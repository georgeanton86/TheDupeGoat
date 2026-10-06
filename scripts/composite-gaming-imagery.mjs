import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// These hand-traced silhouettes only change alpha. Source bottle RGB pixels,
// including every letter on the labels, remain untouched by generation.
// ImageMagick supplies antialiasing, resizing, shadows and compositing.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sources = path.join(root, "attached_assets/generated_images");
const output = path.join(root, "client/public/gaming");
mkdirSync(output, { recursive: true });
const convert = (...args) => execFileSync("convert", args, { stdio: "inherit" });
const bottles = [
  {
    slug: "player-one",
    outline: "M 254,108 Q 400,91 578,91 L 607,352 Q 625,368 621,399 L 642,687 Q 654,746 629,773 Q 607,806 530,815 Q 446,829 385,802 Q 356,790 348,755 L 289,445 Q 278,412 291,393 Z",
    reflectionWidth: 454,
  },
  {
    slug: "play-again",
    outline: "M 291,96 Q 445,89 597,90 L 593,369 Q 608,383 607,413 L 603,733 Q 603,770 578,791 Q 555,815 452,815 Q 351,814 329,787 Q 309,766 307,730 L 292,424 Q 286,392 299,372 Z",
    reflectionWidth: 361,
  },
  {
    slug: "half-life",
    outline: "M 296,102 Q 475,95 632,91 L 615,382 Q 621,391 617,420 L 589,707 Q 584,767 557,794 Q 534,819 470,818 Q 379,813 307,768 Q 267,743 267,698 L 272,414 Q 271,380 284,363 Z",
    reflectionWidth: 420,
  },
];

for (const { slug, outline, reflectionWidth } of bottles) {
  const source = path.join(sources, `chicago-${slug}-studio.jpg`);
  const cutout = path.join(output, `${slug}-bottle-cutout.png`);
  const mask = path.join(output, `${slug}-bottle-mask.png`);
  const reflection = path.join(output, `${slug}-reflection.png`);
  convert("-size", "900x900", "xc:black", "-fill", "white", "-stroke", "none",
    "-draw", `path '${outline}'`, mask);
  convert(source, mask, "-alpha", "off", "-compose", "CopyOpacity", "-composite", cutout);
  convert(cutout, "-trim", "+repage", "-flip", "-resize", `${reflectionWidth}x150!`,
    "-channel", "A", "-evaluate", "multiply", "0.13", "+channel", reflection);
  convert(path.join(sources, `gaming-${slug}-background.jpg`),
    "-resize", "1024x1024!", "-fill", "rgba(5,12,18,0.62)", "-stroke", "none",
    "-draw", "ellipse 512,887 170,15 0,360",
    reflection, "-geometry", `+${Math.round((1024 - reflectionWidth) / 2)}+892`,
    "-compose", "Over", "-composite",
    "(", cutout, "-resize", "1024x1024", ")",
    "-geometry", "+0-40", "-compose", "Over", "-composite",
    "-sampling-factor", "4:4:4", "-quality", "94",
    path.join(output, `${slug}-cinematic.jpg`));
}

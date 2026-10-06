import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import test from "node:test";
import { chicagoBottleImages, chicagoOffers } from "../shared/chicago";

const slugs = ["player-one", "play-again", "half-life"];

test("Gaming offers resolve to retained, deployable cinematic assets", () => {
  chicagoOffers.forEach((offer, index) => {
    assert.equal(offer.imageUrl, `/gaming/${slugs[index]}-cinematic.jpg`);
    assert.equal(chicagoBottleImages[offer.name], offer.imageUrl);
    assert.ok(existsSync(`client/public${offer.imageUrl}`));
    assert.ok(existsSync(`attached_assets/generated_images/chicago-${slugs[index]}-studio.jpg`));
    const size = execFileSync("identify", ["-format", "%wx%h", `client/public${offer.imageUrl}`]).toString();
    assert.equal(size, "1024x1024");
  });
});

test("Photographed label pixels are unchanged in lossless cutouts", () => {
  slugs.forEach(slug => {
    const source = `attached_assets/generated_images/chicago-${slug}-studio.jpg`;
    const cutout = `attached_assets/generated_images/gaming-compositing/${slug}-bottle-cutout.png`;
    const labelPixels = (file: string) => execFileSync("convert", [
      file, "-crop", "150x150+350+500", "+repage", "-alpha", "off", "-depth", "8", "RGB:-",
    ]);
    assert.deepEqual(labelPixels(cutout), labelPixels(source), `${slug}: label RGB must be original pixels`);
    const alpha = execFileSync("convert", [
      cutout, "-crop", "150x150+350+500", "+repage", "-alpha", "extract", "-format", "%[fx:minima]", "info:",
    ]).toString();
    assert.equal(alpha, "1", `${slug}: label must remain fully opaque`);
  });
});

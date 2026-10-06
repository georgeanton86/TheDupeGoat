# Gaming cinematic reference imagery

The three `*-cinematic.jpg` assets are 1024 × 1024 composites. They use the
existing photographed bottle pixels and original label artwork, with
hand-traced alpha masks. No image model generated or edited the bottles.
Resampling and JPEG compression are the only changes to bottle RGB content.

Original sources remain unchanged:

- `attached_assets/generated_images/chicago-player-one-studio.jpg`
- `attached_assets/generated_images/chicago-play-again-studio.jpg`
- `attached_assets/generated_images/chicago-half-life-studio.jpg`

Generated background-only plates are retained as
`attached_assets/generated_images/gaming-*-background.jpg`. Subjects are,
respectively, a Chicago riverwalk, an amber-lit brick alley, and a lakefront
twilight setting. Botanical still-life elements are decorative art direction,
not a change to the published fragrance blends or notes.

Rebuild with `node scripts/composite-gaming-imagery.mjs` (requires ImageMagick).
Lossless cutouts, alpha masks, and reflection layers are retained under
`attached_assets/generated_images/gaming-compositing/`.

Shared catalog image paths are defined in `shared/chicago.ts` and consumed by
the storefront, details, and existing API catalog initialization. These images
remain reference artwork: customers receive the separately disclosed TDG
decant packaging. Existing reference-photo rights are not newly verified by
this compositing work.

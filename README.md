# Swapping photos

- `hero/hero-main.jpg` — the full-bleed homepage & portal hero image.
- `story/` — the four "Our Story" chapter photos, plus the moments strip
  on the homepage. File names describe which photo they are; swap the file
  in place (keep the same name) to replace one without touching any code.
- `gallery/full/photo-01.jpg` … `photo-12.jpg` — the full gallery grid, in
  display order. Add more by dropping in `photo-13.jpg` etc. and adding a
  matching entry to `fullGallery` in `src/lib/photos.ts` (needs the pixel
  width/height so the gallery never shifts while loading).
- `venues/church-placeholder.svg` and `venues/doltone-house-placeholder.svg`
  — clean placeholder graphics used until you add real venue photos.
  Replace with a real `.jpg`/`.png` of the same name (or update the path in
  `src/lib/config.ts` under `ceremony.photo` / `reception.photo`).

All photos are served as-is from this folder — no CMS, no upload step.
Keep long-edge sizes around 2000–2600px for a good balance of sharpness and
page-load speed; anything larger just makes the site slower to load without
looking any sharper on screen.

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface GalleryPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close, next, prev]);

  return (
    <>
      <div className="columns-2 sm:columns-3 gap-3 sm:gap-4 [column-fill:_balance]">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="mb-3 sm:mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm group relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine-600"
            aria-label={`View photo: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="w-full h-auto object-cover transition-transform duration-700 ease-elegant group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/10 transition-colors duration-500" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-ink-900/95 flex items-center justify-center px-2 sm:px-10 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            if (delta > 50) prev();
            else if (delta < -50) next();
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo viewer"
            className="absolute top-5 right-5 sm:top-8 sm:right-8 text-ivory-100/80 hover:text-ivory-100 text-3xl leading-none"
          >
            &times;
          </button>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="hidden sm:flex absolute left-6 h-11 w-11 items-center justify-center rounded-full border border-ivory-100/30 text-ivory-100 hover:bg-ivory-100/10"
          >
            ‹
          </button>

          <figure className="max-h-[86vh] max-w-[92vw] sm:max-w-[80vw] flex flex-col items-center">
            <Image
              key={photos[activeIndex].src}
              src={photos[activeIndex].src}
              alt={photos[activeIndex].alt}
              width={photos[activeIndex].width}
              height={photos[activeIndex].height}
              sizes="90vw"
              priority
              className="max-h-[78vh] w-auto h-auto object-contain rounded-sm"
            />
            {photos[activeIndex].caption && (
              <figcaption className="mt-4 text-ivory-200/80 text-sm text-center">
                {photos[activeIndex].caption}
              </figcaption>
            )}
          </figure>

          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="hidden sm:flex absolute right-6 h-11 w-11 items-center justify-center rounded-full border border-ivory-100/30 text-ivory-100 hover:bg-ivory-100/10"
          >
            ›
          </button>

          <div className="sm:hidden absolute bottom-6 inset-x-0 flex justify-center gap-2">
            {photos.map((_, i) => (
              <span
                key={i}
                className={clsx(
                  "h-1.5 w-1.5 rounded-full",
                  i === activeIndex ? "bg-ivory-100" : "bg-ivory-100/30"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

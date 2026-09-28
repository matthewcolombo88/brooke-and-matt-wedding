import { GalleryLightbox } from "@/components/GalleryLightbox";
import { fullGallery } from "@/lib/photos";

export const metadata = { title: "Gallery" };

export default function PortalGalleryPage() {
  return (
    <section className="pt-16 pb-24 sm:pt-20 sm:pb-28">
      <div className="container-content">
        <p className="eyebrow text-center">Us, In Photos</p>
        <h1 className="mt-3 mb-14 font-serif text-3xl sm:text-4xl text-ink-900 text-center">Gallery</h1>
        <GalleryLightbox photos={fullGallery} />
      </div>
    </section>
  );
}

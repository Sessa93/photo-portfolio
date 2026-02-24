import Image from "next/image";
import Link from "next/link";
import { getPhotos } from "@/lib/db";
import { getImageSrc, needsProxy } from "@/lib/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  let photos: Awaited<ReturnType<typeof getPhotos>> = [];
  try {
    photos = await getPhotos();
  } catch {
    // DB not ready yet — show empty grid
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0c0c0c]">
      {/* Header */}
      <header className="w-full max-w-7xl px-4 pt-24 text-center sm:px-8 sm:pt-32" style={{ marginBottom: "40px", marginTop: "30px"}}>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-medium italic tracking-wide text-white sm:text-5xl">
          Andrea Sessa
        </h1>
        <p className="mt-3 text-sm text-neutral-500">
          A curated collection of moments and light.
        </p>
      </header>

      {/* Separator */}
      <div className="w-full max-w-7xl px-4 sm:px-8" style={{marginBottom: "30px"}}>
        <div className="h-px bg-neutral-800/60" />
      </div>

      {/* Grid */}
      <section className="w-full max-w-7xl px-4 pb-16 pt-12 sm:px-8">
        <div className="columns-1 gap-5 sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-7">
          {photos.map((photo) => (
            <Link
              key={photo.id}
              href={`/photo/${photo.id}`}
              className="group relative block overflow-hidden rounded-md bg-neutral-900 break-inside-avoid"
              style={{ marginBottom: "20px" }}
            >
              <Image
                src={getImageSrc(photo.url)}
                alt={photo.title}
                width={800}
                height={600}
                unoptimized={needsProxy(photo.url)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="block w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex items-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="w-full bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10 text-sm font-light text-white">
                  {photo.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Separator */}
      <div className="w-full max-w-7xl px-4 sm:px-8" style={{ marginTop: "30px", marginBottom: "10px"}}>
        <div className="h-px bg-neutral-800/60" />
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl px-4 py-12 text-center sm:px-8" style={{ marginTop: "5px", marginBottom: "30px" }}>
        <p className="text-xs tracking-wide text-neutral-600">
          &copy; {new Date().getFullYear()} Andrea Sessa. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

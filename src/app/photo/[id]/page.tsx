import Image from "next/image";
import NavButton from "@/components/NavButton";
import { notFound } from "next/navigation";
import { getPhotoById } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const photo = await getPhotoById(id);
    if (!photo) return { title: "Not Found" };
    return { title: `${photo.title} — Portfolio` };
  } catch {
    return { title: "Portfolio" };
  }
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col" style={{ gap: "5px" }}>
      <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
        {label}
      </span>
      <span className="text-sm text-neutral-200">{value}</span>
    </div>
  );
}

export default async function PhotoDetail({ params }: PageProps) {
  const { id } = await params;
  let photo;
  try {
    photo = await getPhotoById(id);
  } catch {
    notFound();
  }
  if (!photo) notFound();

  return (
    <main className="min-h-screen bg-[#0c0c0c] animate-fade-in">
      {/* Side-by-side layout */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left: Image */}
        <div
          className="relative flex items-center justify-center lg:w-[60%] lg:sticky lg:top-0 lg:h-screen"
          style={{ padding: "24px" }}
        >
          <div className="relative h-[50vh] w-full overflow-hidden rounded-md lg:h-[calc(100vh-40px)]">
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              sizes="(min-width: 1024px) 56vw, 95vw"
              className="rounded-lg object-contain"
              priority
            />
          </div>
        </div>

        {/* Right: Details */}
        <div
          className="flex flex-col lg:w-[40%] lg:h-screen lg:overflow-y-auto"
          style={{ padding: "48px clamp(2rem, 4vw, 3.5rem)" }}
        >
          {/* Top spacer to vertically center content on tall screens */}
          <div className="flex-1" />

          {/* Content constrained to a comfortable reading measure */}
          <div className="w-full" style={{ maxWidth: "34rem" }}>
            {/* Back button — above the title */}
            <div style={{ marginBottom: "28px" }}>
              <NavButton
                href="/"
                as="link"
                className="inline-flex items-center gap-2 text-sm"
              >
                <span
                  className="inline-flex items-center justify-center rounded-md border border-neutral-700 bg-neutral-900 transition-all"
                  style={{ width: "32px", height: "32px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </span>
                Back
              </NavButton>
            </div>

            {/* Title */}
            <h1 className="font-(family-name:--font-playfair) text-3xl font-normal italic tracking-tight text-white sm:text-4xl">
              {photo.title}
            </h1>

            {/* Location */}
            {photo.location && (
              <p
                style={{ marginTop: "12px" }}
                className="flex items-center gap-2 text-sm text-neutral-500 italic"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {photo.location}
              </p>
            )}

            {/* Description */}
            <p
              style={{ marginTop: "24px" }}
              className="text-base italic leading-[1.85] text-neutral-300"
            >
              {photo.description}
            </p>

            {/* Camera details */}
            {(photo.camera || photo.lens || photo.settings || photo.film) && (
              <div
                style={{ marginTop: "28px", paddingTop: "28px" }}
                className="border-t border-neutral-800"
              >
                <div className="flex flex-col italic" style={{ gap: "18px" }}>
                  <DetailRow label="Camera" value={photo.camera} />
                  <DetailRow label="Lens" value={photo.lens} />
                  <DetailRow label="Settings" value={photo.settings} />
                  <DetailRow label="Film" value={photo.film} />
                </div>
              </div>
            )}

            {/* Tags */}
            {photo.tags && photo.tags.trim() && (
              <div
                style={{ marginTop: "28px", paddingTop: "28px" }}
                className="border-t border-neutral-800"
              >
                <div className="flex flex-wrap" style={{ gap: "8px" }}>
                  {photo.tags.split(",").map((tag, i) => {
                    const trimmed = tag.trim();
                    if (!trimmed) return null;
                    return (
                      <span
                        key={i}
                        className="inline-block rounded-sm border border-neutral-700/50 bg-neutral-800/40 text-[10px] tracking-wide text-neutral-400 backdrop-blur-sm"
                        style={{ padding: "3px 8px" }}
                      >
                        {trimmed}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom spacer */}
          <div className="flex-1" />
        </div>
      </div>
    </main>
  );
}

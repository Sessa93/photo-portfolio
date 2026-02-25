import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getPhotoById} from "@/lib/db";
import {getImageSrc, needsProxy} from "@/lib/image";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({params}: PageProps) {
    const {id} = await params;
    try {
        const photo = await getPhotoById(id);
        if (!photo) return {title: "Not Found"};
        return {title: `${photo.title} — Portfolio`};
    } catch {
        return {title: "Portfolio"};
    }
}

function DetailRow({label, value}: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div>
            <span className="block text-[11px] uppercase tracking-[0.25em] text-neutral-700">{label}</span>
            <span className="mt-1 block text-sm text-neutral-300">{value}</span>
        </div>
    );
}

export default async function PhotoDetail({params}: PageProps) {
    const {id} = await params;
    let photo;
    try {
        photo = await getPhotoById(id);
    } catch {
        notFound();
    }
    if (!photo) notFound();

    return (
        <main className="min-h-screen bg-[#0c0c0c] animate-fade-in">
            {/* Back button — top left of page */}
            <div className="fixed top-0 left-0 z-20" style={{padding: "24px"}}>
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
                >
          <span
              className="inline-flex items-center justify-center rounded-md border border-neutral-700 bg-neutral-900 transition-all group-hover:border-neutral-500 group-hover:bg-neutral-800"
              style={{width: "32px", height: "32px"}}>
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
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </span>
                    Back
                </Link>
            </div>

            {/* Side-by-side layout */}
            <div className="flex min-h-screen flex-col lg:flex-row">
                {/* Left: Image */}
                <div className="relative flex items-center justify-center lg:w-[60%] lg:sticky lg:top-0 lg:h-screen"
                     style={{padding: "24px"}}>
                    <div className="relative h-[50vh] w-full overflow-hidden rounded-md lg:h-[calc(100vh-40px)]">
                        <Image
                            src={getImageSrc(photo.url)}
                            alt={photo.title}
                            fill
                            unoptimized={needsProxy(photo.url)}
                            sizes="(min-width: 1024px) 56vw, 95vw"
                            className="rounded-lg object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex flex-col px-8 py-16 sm:px-12 lg:w-[40%] lg:px-16 lg:h-screen lg:overflow-y-auto"
                     style={{paddingTop: "24px", paddingBottom: "24px"}}>
                    {/* Top spacer to vertically center content */}
                    <div className="flex-1"/>

                    {/* Title */}
                    <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-normal italic tracking-tight text-white sm:text-4xl lg:text-4xl">
                        {photo.title}
                    </h1>

                    {/* Location */}
                    {photo.location && (
                        <p style={{marginTop: "10px"}}
                           className="flex items-center gap-2 text-sm text-neutral-500 italic">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {photo.location}
                        </p>
                    )}

                    {/* Divider */}
                    <div style={{marginTop: "3px", marginBottom: "3px"}} className="h-px bg-neutral-800"/>

                    {/* Description */}
                    <p style={{marginTop: "3px", marginBottom: "3px"}}
                       className="text-base italic leading-[2.5] text-neutral-400">
                        {photo.description}
                    </p>

                    {/* Camera details */}
                    {(photo.camera || photo.lens || photo.settings || photo.film) && (
                        <>
                            <div style={{marginTop: "3px", marginBottom: "3px"}} className="my-6 h-px bg-neutral-800"/>
                            <div className="space-y-5 italic">
                                <DetailRow label="Camera" value={photo.camera}/>
                                <DetailRow label="Lens" value={photo.lens}/>
                                <DetailRow label="Settings" value={photo.settings}/>
                                <DetailRow label="Film" value={photo.film}/>
                            </div>
                        </>
                    )}

                    {/* Bottom spacer */}
                    <div className="flex-1"/>
                </div>
            </div>
        </main>
    );
}

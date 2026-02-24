"use client";

import { useState } from "react";
import { DbPhoto } from "@/lib/db";
import Image from "next/image";
import { getImageSrc, needsProxy } from "@/lib/image";

interface Props {
  initialPhotos: DbPhoto[];
}

export default function PhotoTable({ initialPhotos }: Props) {
  const [photos, setPhotos] = useState<DbPhoto[]>(initialPhotos);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  // Exposed so parent can inject newly added photos
  (PhotoTable as { addPhoto?: (p: DbPhoto) => void }).addPhoto = (photo) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  if (photos.length === 0) {
    return (
      <p className="text-sm text-neutral-500" style={{ marginTop: "32px" }}>
        No photos yet. Use the form above to add your first one.
      </p>
    );
  }

  return (
    <div style={{ marginTop: "24px" }}>
      <div className="h-px bg-neutral-800" style={{ marginBottom: "24px" }} />
      <p className="text-xs uppercase tracking-widest text-neutral-600" style={{ marginBottom: "16px" }}>
        {photos.length} photo{photos.length !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-col gap-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900"
            style={{ padding: "12px 16px" }}
          >
            {/* Thumbnail */}
            <div
              className="relative shrink-0 overflow-hidden rounded-md bg-neutral-800"
              style={{ width: "56px", height: "40px" }}
            >
              <Image
                src={getImageSrc(photo.url)}
                alt={photo.title}
                fill
                unoptimized={needsProxy(photo.url)}
                className="object-cover"
                sizes="56px"
              />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white">{photo.title}</p>
              <p className="truncate text-xs text-neutral-500">{photo.location ?? photo.url}</p>
            </div>

            {/* Sort order badge */}
            <span className="shrink-0 text-xs text-neutral-600">#{photo.sort_order}</span>

            {/* Delete */}
            <button
              onClick={() => handleDelete(photo.id)}
              disabled={deletingId === photo.id}
              className="shrink-0 rounded-md border border-neutral-800 px-3 py-1 text-xs text-neutral-500 transition-all hover:border-red-900 hover:bg-red-950 hover:text-red-400 disabled:opacity-50"
            >
              {deletingId === photo.id ? "…" : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {DbPhoto} from "@/lib/db";
import AddPhotoForm from "./AddPhotoForm";
import EditPhotoForm from "./EditPhotoForm";
import Link from "next/link";
import Image from "next/image";
import {getImageSrc, needsProxy} from "@/lib/image";

interface Props {
    initialPhotos: DbPhoto[];
    username: string;
}

export default function DashboardClient({initialPhotos, username}: Props) {
    const router = useRouter();
    const [photos, setPhotos] = useState<DbPhoto[]>(initialPhotos);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    function handleAdded(photo: DbPhoto) {
        setPhotos((prev) => [photo, ...prev]);
    }

    function handleSaved(updated: DbPhoto) {
        setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditingId(null);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this photo? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/photos/${id}`, {method: "DELETE"});
            if (res.ok) {
                setPhotos((prev) => prev.filter((p) => p.id !== id));
            }
        } finally {
            setDeletingId(null);
        }
    }

    async function handleLogout() {
        await fetch("/api/admin/logout", {method: "POST"});
        router.push("/admin/login");
    }

    return (
        <main className="min-h-screen bg-[#0c0c0c]" style={{padding: "40px 24px"}}>
            <div style={{maxWidth: "900px", margin: "0 auto"}}>

                {/* Header */}
                <div className="flex items-center justify-between" style={{marginBottom: "40px"}}>
                    <div>
                        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-normal text-white">
                            Portfolio Admin
                        </h1>
                        <p className="text-sm text-neutral-500" style={{marginTop: "4px"}}>
                            Signed in as <span className="text-neutral-300">{username}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="rounded-sm px-7 py-3.5 text-xs text-neutral-400 transition-all hover:text-white"
                        >
                            ← View site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-sm px-7 py-3.5 text-xs text-neutral-400 transition-all hover:text-white"
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                {/* Add photo form */}
                <AddPhotoForm onAdded={handleAdded}/>

                {/* Photo list */}
                {photos.length === 0 ? (
                    <p className="text-sm text-neutral-500" style={{marginTop: "32px"}}>
                        No photos yet. Use the form above to add your first one.
                    </p>
                ) : (
                    <div style={{marginTop: "32px"}}>
                        <div className="h-px bg-neutral-800" style={{marginBottom: "20px"}}/>
                        <p className="text-xs uppercase tracking-widest text-neutral-600"
                           style={{marginBottom: "16px"}}>
                            {photos.length} photo{photos.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-col gap-3">
                            {photos.map((photo) => (
                                <div key={photo.id}>
                                    <div
                                        className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900"
                                        style={{padding: "12px 16px"}}
                                    >
                                        {/* Thumbnail */}
                                        <div
                                            className="relative shrink-0 overflow-hidden rounded-md bg-neutral-800"
                                            style={{width: "60px", height: "44px"}}
                                        >
                                            <Image
                                                src={getImageSrc(photo.url)}
                                                alt={photo.title}
                                                fill
                                                unoptimized={needsProxy(photo.url)}
                                                className="object-cover"
                                                sizes="60px"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm text-white">{photo.title}</p>
                                            <p className="truncate text-xs text-neutral-500">
                                                {photo.location ? `${photo.location} · ` : ""}{photo.camera ?? ""}
                                            </p>
                                        </div>

                                        {/* Edit */}
                                        <button
                                            onClick={() => setEditingId(editingId === photo.id ? null : photo.id)}
                                            className="shrink-0 rounded-sm px-6 py-3.5 text-xs text-neutral-500 transition-all hover:bg-neutral-800 hover:text-white"
                                        >
                                            Edit
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(photo.id)}
                                            disabled={deletingId === photo.id}
                                            className="shrink-0 rounded-sm px-6 py-3.5 text-xs text-neutral-500 transition-all hover:bg-red-950/50 hover:text-red-400 disabled:opacity-40"
                                        >
                                            {deletingId === photo.id ? "…" : "Delete"}
                                        </button>
                                    </div>

                                    {/* Inline edit form */}
                                    {editingId === photo.id && (
                                        <EditPhotoForm
                                            photo={photo}
                                            onSaved={handleSaved}
                                            onCancel={() => setEditingId(null)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

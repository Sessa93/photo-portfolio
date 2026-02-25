"use client";

import {FormEvent, useRef, useState} from "react";
import {DbPhoto} from "@/lib/db";

interface Props {
    onAdded: (photo: DbPhoto) => void;
}

const fields: { name: string; label: string; required?: boolean; placeholder?: string }[] = [
    {name: "url", label: "Image URL", required: true, placeholder: "https://… or Amazon Photos share link"},
    {name: "title", label: "Title", required: true, placeholder: "Mountain Sunrise"},
    {name: "description", label: "Description", placeholder: "A short description of the photo."},
    {name: "location", label: "Location", placeholder: "Dolomites, Italy"},
    {name: "camera", label: "Camera", placeholder: "Sony A7R IV"},
    {name: "lens", label: "Lens", placeholder: "24-70mm f/2.8 GM"},
    {name: "settings", label: "Settings", placeholder: "f/8 · 1/250s · ISO 100"},
    {name: "film", label: "Film", placeholder: "Kodak Portra 400"},
    {name: "tags", label: "Tags", placeholder: "landscape, film, golden hour, mountains"},
    {name: "sort_order", label: "Sort order", placeholder: "0"},
];

export default function AddPhotoForm({onAdded}: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatingTitle, setGeneratingTitle] = useState(false);
    const [generatingDesc, setGeneratingDesc] = useState(false);
    const [generatingTags, setGeneratingTags] = useState(false);
    const [error, setError] = useState("");
    const formRef = useRef<HTMLFormElement>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.currentTarget;
        const body: Record<string, string> = {};
        for (const f of fields) {
            body[f.name] = (form.elements.namedItem(f.name) as HTMLInputElement).value;
        }

        try {
            const res = await fetch("/api/admin/photos", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });
            if (res.ok) {
                const photo = await res.json();
                onAdded(photo);
                form.reset();
                setOpen(false);
            } else {
                const data = await res.json();
                setError(data.error ?? "Failed to add photo.");
            }
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="rounded-sm px-8 py-4 text-sm font-medium text-neutral-200 transition-all hover:text-white"
                >
                    Add Photo
                </button>
            ) : (
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="rounded-lg border border-neutral-800 bg-neutral-900"
                    style={{padding: "24px", marginBottom: "32px"}}
                >
                    <h2 className="text-base font-medium text-white" style={{marginBottom: "20px"}}>
                        New Photo
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {fields.map((f) => (
                            <div key={f.name}
                                 className={f.name === "description" || f.name === "tags" ? "sm:col-span-2" : ""}>
                                <label
                                    htmlFor={f.name}
                                    className="block text-xs uppercase tracking-widest text-neutral-500"
                                    style={{marginBottom: "6px"}}
                                >
                                    {f.label}
                                    {f.required && <span className="text-red-500"> *</span>}
                                </label>
                                {f.name === "tags" ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            id={f.name}
                                            name={f.name}
                                            type="text"
                                            placeholder={f.placeholder}
                                            className="w-full rounded-md border border-neutral-800 bg-neutral-950 text-sm text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
                                            style={{padding: "8px 12px"}}
                                        />
                                        <button
                                            type="button"
                                            disabled={generatingTags}
                                            onClick={async () => {
                                                if (!formRef.current) return;
                                                const urlInput = formRef.current.elements.namedItem("url") as HTMLInputElement;
                                                const imageUrl = urlInput?.value?.trim();
                                                if (!imageUrl) {
                                                    setError("Enter an image URL first to generate with AI.");
                                                    return;
                                                }
                                                setError("");
                                                setGeneratingTags(true);
                                                try {
                                                    const locationInput = formRef.current!.elements.namedItem("location") as HTMLInputElement;
                                                    const res = await fetch("/api/admin/generate", {
                                                        method: "POST",
                                                        headers: {"Content-Type": "application/json"},
                                                        body: JSON.stringify({
                                                            imageUrl,
                                                            location: locationInput?.value?.trim() || "",
                                                            field: "tags"
                                                        }),
                                                    });
                                                    const data = await res.json();
                                                    if (res.ok) {
                                                        const tagsInput = formRef.current!.elements.namedItem("tags") as HTMLInputElement;
                                                        if (tagsInput) tagsInput.value = data.tags;
                                                    } else {
                                                        setError(data.error ?? "Failed to generate tags.");
                                                    }
                                                } catch {
                                                    setError("Network error while generating.");
                                                } finally {
                                                    setGeneratingTags(false);
                                                }
                                            }}
                                            className="shrink-0 rounded-md p-2 text-neutral-400 transition-colors hover:text-white disabled:opacity-50"
                                            title="Generate tags with AI"
                                        >
                                            {generatingTags ? (
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                                            stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor"
                                                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                                                </svg>
                                            ) : (
                                                <span className="text-base">✨</span>
                                            )}
                                        </button>
                                    </div>
                                ) : f.name === "description" ? (
                                    <div className="flex gap-2 items-start">
                                        <textarea
                                            id={f.name}
                                            name={f.name}
                                            rows={3}
                                            placeholder={f.placeholder}
                                            className="w-full rounded-md border border-neutral-800 bg-neutral-950 text-sm text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
                                            style={{padding: "8px 12px", resize: "vertical"}}
                                        />
                                        <button
                                            type="button"
                                            disabled={generatingDesc}
                                            onClick={async () => {
                                                if (!formRef.current) return;
                                                const urlInput = formRef.current.elements.namedItem("url") as HTMLInputElement;
                                                const imageUrl = urlInput?.value?.trim();
                                                if (!imageUrl) {
                                                    setError("Enter an image URL first to generate with AI.");
                                                    return;
                                                }
                                                setError("");
                                                setGeneratingDesc(true);
                                                try {
                                                    const locationInput = formRef.current!.elements.namedItem("location") as HTMLInputElement;
                                                    const res = await fetch("/api/admin/generate", {
                                                        method: "POST",
                                                        headers: {"Content-Type": "application/json"},
                                                        body: JSON.stringify({
                                                            imageUrl,
                                                            location: locationInput?.value?.trim() || "",
                                                            field: "description"
                                                        }),
                                                    });
                                                    const data = await res.json();
                                                    if (res.ok) {
                                                        const descInput = formRef.current!.elements.namedItem("description") as HTMLTextAreaElement;
                                                        if (descInput) descInput.value = data.description;
                                                    } else {
                                                        setError(data.error ?? "Failed to generate description.");
                                                    }
                                                } catch {
                                                    setError("Network error while generating.");
                                                } finally {
                                                    setGeneratingDesc(false);
                                                }
                                            }}
                                            className="shrink-0 rounded-md p-2 text-neutral-400 transition-colors hover:text-white disabled:opacity-50"
                                            title="Generate description with AI"
                                        >
                                            {generatingDesc ? (
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                                            stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor"
                                                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                                                </svg>
                                            ) : (
                                                <span className="text-base">✨</span>
                                            )}
                                        </button>
                                    </div>
                                ) : f.name === "title" ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            id={f.name}
                                            name={f.name}
                                            type="text"
                                            required={f.required}
                                            placeholder={f.placeholder}
                                            className="w-full rounded-md border border-neutral-800 bg-neutral-950 text-sm text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
                                            style={{padding: "8px 12px"}}
                                        />
                                        <button
                                            type="button"
                                            disabled={generatingTitle}
                                            onClick={async () => {
                                                if (!formRef.current) return;
                                                const urlInput = formRef.current.elements.namedItem("url") as HTMLInputElement;
                                                const imageUrl = urlInput?.value?.trim();
                                                if (!imageUrl) {
                                                    setError("Enter an image URL first to generate with AI.");
                                                    return;
                                                }
                                                setError("");
                                                setGeneratingTitle(true);
                                                try {
                                                    const locationInput = formRef.current!.elements.namedItem("location") as HTMLInputElement;
                                                    const res = await fetch("/api/admin/generate", {
                                                        method: "POST",
                                                        headers: {"Content-Type": "application/json"},
                                                        body: JSON.stringify({
                                                            imageUrl,
                                                            location: locationInput?.value?.trim() || "",
                                                            field: "title"
                                                        }),
                                                    });
                                                    const data = await res.json();
                                                    if (res.ok) {
                                                        const titleInput = formRef.current!.elements.namedItem("title") as HTMLInputElement;
                                                        if (titleInput) titleInput.value = data.title;
                                                    } else {
                                                        setError(data.error ?? "Failed to generate title.");
                                                    }
                                                } catch {
                                                    setError("Network error while generating.");
                                                } finally {
                                                    setGeneratingTitle(false);
                                                }
                                            }}
                                            className="shrink-0 rounded-md p-2 text-neutral-400 transition-colors hover:text-white disabled:opacity-50"
                                            title="Generate title with AI"
                                        >
                                            {generatingTitle ? (
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                                            stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor"
                                                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                                                </svg>
                                            ) : (
                                                <span className="text-base">✨</span>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        id={f.name}
                                        name={f.name}
                                        type={f.name === "sort_order" ? "number" : "text"}
                                        required={f.required}
                                        placeholder={f.placeholder}
                                        className="w-full rounded-md border border-neutral-800 bg-neutral-950 text-sm text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
                                        style={{padding: "8px 12px"}}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p className="text-sm text-red-400" style={{marginTop: "12px"}}>
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3" style={{marginTop: "20px"}}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-sm bg-white px-8 py-4 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-200 disabled:opacity-50"
                        >
                            {loading ? "Saving…" : "Save photo"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                setError("");
                            }}
                            className="rounded-sm px-8 py-4 text-sm text-neutral-400 transition-all hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

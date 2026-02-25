"use client";

import {FormEvent, useState} from "react";
import {DbPhoto} from "@/lib/db";

interface Props {
    photo: DbPhoto;
    onSaved: (photo: DbPhoto) => void;
    onCancel: () => void;
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
    {name: "sort_order", label: "Sort order", placeholder: "0"},
];

export default function EditPhotoForm({photo, onSaved, onCancel}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function defaultValue(name: string): string {
        const val = photo[name as keyof DbPhoto];
        if (val == null) return "";
        if (val instanceof Date) return "";
        return String(val);
    }

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
            const res = await fetch(`/api/admin/photos/${photo.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });
            if (res.ok) {
                const updated = await res.json();
                onSaved(updated);
            } else {
                const data = await res.json();
                setError(data.error ?? "Failed to update photo.");
            }
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-neutral-800 bg-neutral-900"
            style={{padding: "24px", marginBottom: "32px"}}
        >
            <h2 className="text-base font-medium text-white" style={{marginBottom: "20px"}}>
                Edit Photo
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                    <div key={f.name} className={f.name === "description" ? "sm:col-span-2" : ""}>
                        <label
                            htmlFor={`edit-${f.name}`}
                            className="block text-xs uppercase tracking-widest text-neutral-500"
                            style={{marginBottom: "6px"}}
                        >
                            {f.label}
                            {f.required && <span className="text-red-500"> *</span>}
                        </label>
                        {f.name === "description" ? (
                            <textarea
                                id={`edit-${f.name}`}
                                name={f.name}
                                rows={3}
                                defaultValue={defaultValue(f.name)}
                                placeholder={f.placeholder}
                                className="w-full rounded-md border border-neutral-800 bg-neutral-950 text-sm text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
                                style={{padding: "8px 12px", resize: "vertical"}}
                            />
                        ) : (
                            <input
                                id={`edit-${f.name}`}
                                name={f.name}
                                type={f.name === "sort_order" ? "number" : "text"}
                                required={f.required}
                                defaultValue={defaultValue(f.name)}
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
                    className="rounded-sm px-8 py-4 text-sm font-medium text-neutral-200 transition-all hover:text-white disabled:opacity-50"
                >
                    {loading ? "Saving…" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-sm px-8 py-4 text-sm text-neutral-400 transition-all hover:text-white"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

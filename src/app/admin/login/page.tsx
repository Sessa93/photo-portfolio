"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Invalid credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0c0c0c] px-4">
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-normal text-white" style={{ marginBottom: "8px" }}>
          Admin
        </h1>
        <p className="text-sm text-neutral-500" style={{ marginBottom: "32px" }}>
          Sign in to manage your portfolio.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="username"
              className="block text-xs uppercase tracking-widest text-neutral-500"
              style={{ marginBottom: "8px" }}
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
              style={{ padding: "10px 14px" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-widest text-neutral-500"
              style={{ marginBottom: "8px" }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 text-sm text-white placeholder-neutral-600 outline-none focus:border-neutral-600"
              style={{ padding: "10px 14px" }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" style={{ marginBottom: "16px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white py-3 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-200 disabled:opacity-50"
            style={{ padding: "12px 20px" }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

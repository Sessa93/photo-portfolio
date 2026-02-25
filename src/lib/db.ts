import {Pool} from "pg";

const globalForPg = globalThis as unknown as { pgPool: Pool };

export const pool =
    globalForPg.pgPool ??
    new Pool({
        connectionString:
            process.env.DATABASE_URL ??
            "postgresql://postgres:postgres@localhost:5432/photo_portfolio",
    });

if (process.env.NODE_ENV !== "production") {
    globalForPg.pgPool = pool;
}

export interface DbPhoto {
    id: string;
    title: string;
    description: string;
    url: string;
    camera: string | null;
    lens: string | null;
    settings: string | null;
    location: string | null;
    film: string | null;
    sort_order: number;
    created_at: Date;
}

export async function getPhotos(): Promise<DbPhoto[]> {
    const {rows} = await pool.query<DbPhoto>(
        "SELECT * FROM photos ORDER BY sort_order ASC, created_at DESC"
    );
    return rows;
}

export async function getPhotoById(id: string): Promise<DbPhoto | null> {
    const {rows} = await pool.query<DbPhoto>(
        "SELECT * FROM photos WHERE id = $1",
        [id]
    );
    return rows[0] ?? null;
}

export async function insertPhoto(
    data: Omit<DbPhoto, "created_at">
): Promise<DbPhoto> {
    const {rows} = await pool.query<DbPhoto>(
        `INSERT INTO photos (id, title, description, url, camera, lens, settings, location, film, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
        [
            data.id,
            data.title,
            data.description,
            data.url,
            data.camera || null,
            data.lens || null,
            data.settings || null,
            data.location || null,
            data.film || null,
            data.sort_order ?? 0,
        ]
    );
    return rows[0];
}

export async function updatePhoto(
    id: string,
    data: Partial<Omit<DbPhoto, "id" | "created_at">>
): Promise<DbPhoto | null> {
    const allowed = ["title", "description", "url", "camera", "lens", "settings", "location", "film", "sort_order"] as const;
    const sets: string[] = [];
    const vals: unknown[] = [];
    let idx = 1;
    for (const key of allowed) {
        if (key in data) {
            sets.push(`${key} = $${idx++}`);
            vals.push(data[key as keyof typeof data] ?? null);
        }
    }
    if (sets.length === 0) return null;
    vals.push(id);
    const {rows} = await pool.query<DbPhoto>(
        `UPDATE photos SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
        vals
    );
    return rows[0] ?? null;
}

export async function deletePhoto(id: string): Promise<void> {
    await pool.query("DELETE FROM photos WHERE id = $1", [id]);
}

#!/usr/bin/env node
// Bootstrap the database schema.
// Usage: node scripts/bootstrap-db.mjs
// Env:   DATABASE_URL (optional, defaults to postgres://postgres:postgres@localhost:5432/photo_portfolio)

import pg from "pg";

const {Pool} = pg;

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/photo_portfolio",
});

const schema = `
    CREATE TABLE IF NOT EXISTS admin_users
    (
        id
        SERIAL
        PRIMARY
        KEY,
        username
        TEXT
        UNIQUE
        NOT
        NULL,
        password_hash
        TEXT
        NOT
        NULL,
        created_at
        TIMESTAMPTZ
        DEFAULT
        NOW
    (
    )
        );

    CREATE TABLE IF NOT EXISTS photos
    (
        id
        TEXT
        PRIMARY
        KEY,
        title
        TEXT
        NOT
        NULL,
        description
        TEXT
        NOT
        NULL
        DEFAULT
        '',
        url
        TEXT
        NOT
        NULL,
        camera
        TEXT,
        lens
        TEXT,
        settings
        TEXT,
        location
        TEXT,
        film
        TEXT,
        sort_order
        INTEGER
        NOT
        NULL
        DEFAULT
        0,
        created_at
        TIMESTAMPTZ
        DEFAULT
        NOW
    (
    )
        );

    CREATE INDEX IF NOT EXISTS photos_sort_order_idx ON photos (sort_order ASC, created_at DESC);
`;

const migrations = `
    ALTER TABLE photos
        ADD COLUMN IF NOT EXISTS film TEXT;
    ALTER TABLE photos
        ADD COLUMN IF NOT EXISTS tags TEXT;
`;

try {
    await pool.query(schema);
    await pool.query(migrations);
    console.log("\u2713 Database schema bootstrapped successfully.");
    console.log("  Tables created: admin_users, photos");
    console.log("  Migrations applied.");
} catch (err) {
    console.error("\u2717 Error bootstrapping database:", err.message);
    process.exit(1);
} finally {
    await pool.end();
}

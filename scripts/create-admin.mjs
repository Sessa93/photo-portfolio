#!/usr/bin/env node
// Create an admin user.
// Usage: node scripts/create-admin.mjs <username> <password>
// Env:   DATABASE_URL (optional, defaults to postgres://postgres:postgres@localhost:5432/photo_portfolio)

import pg from "pg";
import bcrypt from "bcryptjs";
import { createInterface } from "readline";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/photo_portfolio",
});

async function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  let [, , username, password] = process.argv;

  if (!username) {
    username = await prompt("Username: ");
  }
  if (!username) {
    console.error("✗ Username is required.");
    process.exit(1);
  }

  if (!password) {
    password = await prompt("Password: ");
  }
  if (!password || password.length < 8) {
    console.error("✗ Password must be at least 8 characters.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  try {
    const { rows } = await pool.query(
      `INSERT INTO admin_users (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id, username, created_at`,
      [username, hash]
    );
    const user = rows[0];
    console.log(`✓ Admin user '${user.username}' saved (id: ${user.id}).`);
  } catch (err) {
    console.error("✗ Error creating admin user:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL é obrigatório para db:migrate");
const sql = postgres(url, {max:1});
try {
  const migration = await fs.readFile(path.join(process.cwd(), "drizzle/0000_validation_v0.sql"), "utf8");
  await sql.unsafe(migration);
  console.log("Migration v0 aplicada.");
} finally { await sql.end(); }

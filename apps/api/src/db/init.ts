import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "./pool.js";
import { seed } from "./seed.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function init() {
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);
  console.log("Schema applied.");
  await seed();
  await pool.end();
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { Pool } from "pg";

// All queries elsewhere in this app must go through this pool using parameterized
// queries ($1, $2, ...) — no string-concatenated SQL, per SECURITY.md.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgresql://atlas:atlas@localhost:5432/project_atlas_dev",
});

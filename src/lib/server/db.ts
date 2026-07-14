import postgres from "postgres";
import { env } from "$env/dynamic/private";

// postgres() connects lazily on the first query, so it's safe to construct
// even when DATABASE_URL is unset at build/analyse time (e.g. local builds
// without a database). A real query without a valid URL fails at call time.
export const sql = postgres(env.DATABASE_URL ?? "", {
	ssl: "require"
});

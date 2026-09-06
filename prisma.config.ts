import path from "node:path";
import { defineConfig, env } from "prisma/config";

// Prisma 7 reads the connection string from this file rather than from
// `datasource.url` in schema.prisma. The Prisma CLI does not load .env on its
// own any more, so do it here (Node 20.6+ built-in, no dotenv dependency).
try {
  process.loadEnvFile(path.join(process.cwd(), ".env"));
} catch {
  // No .env file present - fall back to whatever is already in the environment.
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/lib/db/schema*",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  out: "migrations",
} satisfies Config;

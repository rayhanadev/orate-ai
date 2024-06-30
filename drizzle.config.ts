import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/lib/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import "dotenv/config";

export const env = createEnv({
  server: {
    TURSO_AUTH_TOKEN: z.string(),
    TURSO_CONNECTION_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {},
  runtimeEnv: {
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

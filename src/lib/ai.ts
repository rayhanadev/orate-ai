import OpenAI from "openai";

import { env } from "~/env.js";

export const openai = new OpenAI({
  apiKey: env.GROK_API_KEY,
});

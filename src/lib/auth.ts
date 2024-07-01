import { cache } from "react";

import { cookies } from "next/headers";

import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import type { Session, User } from "lucia";
import { Lucia } from "lucia";

import { env } from "~/env.js";

import { db } from "./db";
import { sessions as sessionsTable } from "./db/schema/sessions";
import { users as usersTable } from "./db/schema/users";

const adapter = new DrizzleSQLiteAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<typeof usersTable.$inferSelect, "id">;
  }
}

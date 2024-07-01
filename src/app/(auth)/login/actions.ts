"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { lucia } from "lib/auth";
import { db } from "lib/db";
import { users as usersTable } from "lib/db/schema/users";

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export async function login(
  _: unknown,
  formData: FormData,
): Promise<{ errors: string[] }> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    const errors = Object.entries(fieldErrors)
      .map(([_, error]) => {
        return error;
      })
      .reduce((acc, val) => acc.concat(val), []);

    return {
      errors,
    };
  }

  const { email, password } = validatedFields.data;

  const query = email.includes("@")
    ? eq(usersTable.email, email)
    : eq(usersTable.username, email.toLowerCase());

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(query)
    .execute();

  if (!existingUser[0]) {
    return {
      errors: ["Incorrect username or password"],
    };
  }

  const validPassword = await verify(existingUser[0].passwordHash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    return {
      errors: ["Incorrect username or password"],
    };
  }

  const session = await lucia.createSession(existingUser[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/home");
}

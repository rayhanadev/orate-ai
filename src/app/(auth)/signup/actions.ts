"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

import { lucia } from "lib/auth";
import { db } from "lib/db";
import { users as usersTable } from "lib/db/schema/users";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(
      /^[a-zA-Z\d$!%*?&]+$/,
      "Password may contain only letters, numbers, and the following special characters: $!%*?&",
    ),
});

export async function signup(
  _: unknown,
  formData: FormData,
): Promise<{ errors: string[] }> {
  const validatedFields = signupSchema.safeParse({
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

  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateIdFromEntropySize(10);

  await db.insert(usersTable).values({
    id: userId,
    email: email,
    username:
      `${email.split("@")[0]!.replace(/[^a-zA-Z0-9_-]/g, "")}+${userId}`.toLowerCase(),
    passwordHash: passwordHash,
    timeCreated: new Date().toISOString(),
    timeUpdated: new Date().toISOString(),
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/home");
}

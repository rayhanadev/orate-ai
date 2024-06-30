"use server";

import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionResult } from "next/dist/server/app-render/types";
import { z } from "zod";

import { db } from "lib/db";
import { users as usersTable } from "lib/db/schema/users";
import { lucia } from "lib/auth";

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
  _: any,
  formData: FormData,
): Promise<ActionResult> {
  const validatedFields = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = validatedFields.error.flatten();
    const errors = Object.entries(fieldErrors).map(([_, error]) => {
      return error;
    });

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

  console.log({
    id: userId,
    email: email,
    username: `${email.split("@")[0]!.replace(/[^a-zA-Z0-9_-]/g, "")}+${userId}`,
    password_hash: hash,
  });

  await db.insert(usersTable).values({
    id: userId,
    email: email,
    username:
      `${email.split("@")[0]!.replace(/[^a-zA-Z0-9_-]/g, "")}+${userId}`.toLowerCase(),
    passwordHash: passwordHash,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/onboarding");
}

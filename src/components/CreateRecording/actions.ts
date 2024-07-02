"use server";

import { redirect } from "next/navigation";

import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

import { validateRequest } from "lib/auth";
import { db } from "lib/db";
import { lectures as lecturesTable } from "lib/db/schema/lectures";

const createRecordingSchema = z.object({
  title: z.string(),
  description: z.string(),
  consent: z.boolean().refine((value) => value === true, {
    message: "You must have consent to record this lecture.",
  }),
});

export type CreateRecordingSchemaType = z.infer<typeof createRecordingSchema>;

export async function submit(data: CreateRecordingSchemaType) {
  const { user } = await validateRequest();

  if (!user) {
    return {
      errors: ["You must be logged in to create a recording."],
    };
  }

  const validatedFields = createRecordingSchema.safeParse(data);

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

  const fileId = generateIdFromEntropySize(10);

  await db.insert(lecturesTable).values({
    id: fileId,
    name: data.title,
    duration: 0,
    userId: user.id,
    folderId: null,
    timeCreated: new Date().toISOString(),
    timeUpdated: new Date().toISOString(),
  });

  return redirect(`/lectures/${fileId}`);
}

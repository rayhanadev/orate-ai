import { redirect } from "next/navigation";

import { and, eq, isNull } from "drizzle-orm";

import CreateRecording from "components/CreateRecording";
import File from "components/File";
import Folder from "components/Folder";
import { validateRequest } from "lib/auth";
import { db } from "lib/db";
import { folders as foldersTable } from "lib/db/schema/folders";
import { lectures as lecturesTable } from "lib/db/schema/lectures";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    path: string;
  };
}) {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/login");
  }

  const folder = searchParams.path ?? "/";
  const parentPath = folder.split("/").slice(0, -1).join("/");

  const folderQuery =
    folder === "/"
      ? isNull(lecturesTable.folderId)
      : eq(foldersTable.path, folder);

  const files = await db
    .select()
    .from(lecturesTable)
    .where(and(eq(lecturesTable.userId, user.id), folderQuery));

  const folders = await db
    .select()
    .from(foldersTable)
    .where(
      and(
        eq(foldersTable.userId, user.id),
        folder === "/" ? isNull(foldersTable.parentId) : folderQuery,
      ),
    );

  return (
    <>
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="my-8 p-2 text-3xl font-bold">Recordings</h1>
        <CreateRecording />
      </div>
      {folders.length > 0 && <Folder path={parentPath} title=".." />}
      {folders.map((folder) => (
        <Folder key={folder.id} path={folder.path} title={folder.name} />
      ))}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        {files.map((file) => (
          <File
            key={file.id}
            slug={file.id}
            title={file.name}
            duration={file.duration}
            timeCreated={new Date(file.timeCreated)}
          />
        ))}
      </div>
    </>
  );
}

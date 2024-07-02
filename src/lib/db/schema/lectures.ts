import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { folders } from "./folders";
import { users } from "./users";

export const lectures = sqliteTable("lectures", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  duration: integer("duration").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  folderId: text("folder_id").references(() => folders.id),
  blobId: text("blob_id"),
  timeCreated: text("time_created").notNull(),
  timeUpdated: text("time_updated").notNull(),
  timeDeleted: text("time_deleted"),
});

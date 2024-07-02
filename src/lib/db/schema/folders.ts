import { foreignKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { users } from "./users";

export const folders = sqliteTable(
  "folders",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    parentId: text("parent_id"),
    path: text("path").notNull(),
    timeCreated: text("time_created").notNull(),
    timeUpdated: text("time_updated").notNull(),
    timeDeleted: text("time_deleted"),
  },
  (table) => {
    return {
      parentReference: foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
        name: "parentId",
      }),
    };
  },
);

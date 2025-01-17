import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password").notNull(),
  timeCreated: text("time_created").notNull(),
  timeUpdated: text("time_updated").notNull(),
  timeDeleted: text("time_deleted"),
});

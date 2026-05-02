import { GENDERS, LANGUAGES } from "@/lib/constants";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userProfile = sqliteTable("user_profile", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  gender: text("gender", { enum: GENDERS }).notNull(),
  language: text("language", { enum: LANGUAGES }).default("es").notNull(),
});

export const exercises = sqliteTable("exercise", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  muscleGroup: text("muscle_group"),
  notes: text("notes"),
  createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

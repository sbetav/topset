import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const exercises = sqliteTable("exercise", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  muscleGroup: text("muscle_group"),
  notes: text("notes"),
  createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const workoutSessions = sqliteTable("workout_session", {
  id: int("id").primaryKey({ autoIncrement: true }),
  startedAt: int("started_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  endedAt: int("ended_at", { mode: "timestamp" }),
  notes: text("notes"),
  createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const workoutSessionExercises = sqliteTable("workout_session_exercise", {
  id: int("id").primaryKey({ autoIncrement: true }),
  sessionId: int("session_id")
    .notNull()
    .references(() => workoutSessions.id, { onDelete: "cascade" }),
  exerciseId: int("exercise_id").references(() => exercises.id, {
    onDelete: "set null",
  }),
  exerciseName: text("exercise_name").notNull(),
  exerciseMuscleGroup: text("exercise_muscle_group"),
  weightUnit: text("weight_unit").notNull().default("kg"),
  notes: text("notes"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const workoutSessionSets = sqliteTable("workout_session_set", {
  id: int("id").primaryKey({ autoIncrement: true }),
  sessionExerciseId: int("session_exercise_id")
    .notNull()
    .references(() => workoutSessionExercises.id, { onDelete: "cascade" }),
  reps: int("reps"),
  weight: real("weight"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: int("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

import { db } from "@/db/client";
import { exercises } from "@/db/schema";
import { asc, eq, like } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export type Exercise = typeof exercises.$inferSelect;

export type ExerciseFormValues = {
  name: string;
  muscleGroup?: string | null;
};

export function useExercises(search = "") {
  const normalizedSearch = search.trim();
  const filters = normalizedSearch
    ? like(exercises.name, `%${normalizedSearch}%`)
    : undefined;

  const query = useLiveQuery(
    db.select().from(exercises).where(filters).orderBy(asc(exercises.name)),
    [normalizedSearch],
  );

  return {
    ...query,
    isPending: !query.updatedAt && !query.error,
  };
}

export function useExercise(id?: number | null) {
  const exerciseId = id ?? -1;

  const query = useLiveQuery(
    db.select().from(exercises).where(eq(exercises.id, exerciseId)).limit(1),
    [exerciseId],
  );

  return {
    ...query,
    data: query.data[0],
    isPending: !query.updatedAt && !query.error,
  };
}

export function useExerciseMutations() {
  async function createExercise(values: ExerciseFormValues) {
    await db.insert(exercises).values({
      name: values.name.trim(),
      muscleGroup: values.muscleGroup ?? null,
    });
  }

  async function updateExercise(id: number, values: ExerciseFormValues) {
    await db
      .update(exercises)
      .set({
        name: values.name.trim(),
        muscleGroup: values.muscleGroup ?? null,
      })
      .where(eq(exercises.id, id));
  }

  async function deleteExercise(id: number) {
    await db.delete(exercises).where(eq(exercises.id, id));
  }

  return {
    createExercise,
    updateExercise,
    deleteExercise,
  };
}

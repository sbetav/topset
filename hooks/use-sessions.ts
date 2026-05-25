import { db } from "@/db/client";
import {
    workoutSessionExercises,
    workoutSessions,
    workoutSessionSets,
} from "@/db/schema";
import type { Exercise } from "@/hooks/use-exercises";
import { type MuscleGroup } from "@/lib/constants";
import { isMuscleGroup } from "@/lib/utils";
import { asc, count, desc, eq, ne } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export const WEIGHT_UNITS = ["kg", "lb"] as const;

export type WeightUnit = (typeof WEIGHT_UNITS)[number];
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type WorkoutSessionExercise =
  typeof workoutSessionExercises.$inferSelect;
export type WorkoutSessionSet = typeof workoutSessionSets.$inferSelect;

export type SessionSetWithExerciseId = WorkoutSessionSet & {
  sessionExerciseId: number;
};

export type LastExerciseMark = {
  exerciseId: number | null;
  exerciseName: string;
  sessionId: number;
  sessionStartedAt: Date;
  reps: number | null;
  weight: number | null;
  weightUnit: string;
  setSortOrder: number;
  setId: number;
};

export type SessionMuscleGroupsBySessionId = Record<number, MuscleGroup[]>;
export type SessionExerciseSearchIndex = Record<
  number,
  {
    exerciseNames: string[];
    muscleGroups: MuscleGroup[];
  }
>;

type UpdateSessionValues = {
  startedAt?: Date;
  notes?: string | null;
};

type UpdateSetValues = {
  reps?: number | null;
  weight?: number | null;
};

export function isWeightUnit(value: unknown): value is WeightUnit {
  return WEIGHT_UNITS.includes(value as WeightUnit);
}

export function useSessions() {
  const query = useLiveQuery(
    db
      .select()
      .from(workoutSessions)
      .orderBy(desc(workoutSessions.startedAt), desc(workoutSessions.id)),
  );

  return {
    ...query,
    isPending: !query.updatedAt && !query.error,
  };
}

export function useSession(id?: number | null) {
  const sessionId = id ?? -1;

  const query = useLiveQuery(
    db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.id, sessionId))
      .limit(1),
    [sessionId],
  );

  return {
    ...query,
    data: query.data[0],
    isPending: !query.updatedAt && !query.error,
  };
}

export function useSessionExercises(sessionId?: number | null) {
  const resolvedSessionId = sessionId ?? -1;

  const query = useLiveQuery(
    db
      .select()
      .from(workoutSessionExercises)
      .where(eq(workoutSessionExercises.sessionId, resolvedSessionId))
      .orderBy(
        asc(workoutSessionExercises.sortOrder),
        asc(workoutSessionExercises.id),
      ),
    [resolvedSessionId],
  );

  return {
    ...query,
    isPending: !query.updatedAt && !query.error,
  };
}

export function useSessionSets(sessionId?: number | null) {
  const resolvedSessionId = sessionId ?? -1;

  const query = useLiveQuery(
    db
      .select({
        id: workoutSessionSets.id,
        sessionExerciseId: workoutSessionSets.sessionExerciseId,
        reps: workoutSessionSets.reps,
        weight: workoutSessionSets.weight,
        sortOrder: workoutSessionSets.sortOrder,
        createdAt: workoutSessionSets.createdAt,
        updatedAt: workoutSessionSets.updatedAt,
      })
      .from(workoutSessionSets)
      .innerJoin(
        workoutSessionExercises,
        eq(workoutSessionSets.sessionExerciseId, workoutSessionExercises.id),
      )
      .where(eq(workoutSessionExercises.sessionId, resolvedSessionId))
      .orderBy(
        asc(workoutSessionExercises.sortOrder),
        asc(workoutSessionSets.sortOrder),
        asc(workoutSessionSets.id),
      ),
    [resolvedSessionId],
  );

  return {
    ...query,
    data: query.data as SessionSetWithExerciseId[],
    isPending: !query.updatedAt && !query.error,
  };
}

export function useLastExerciseMarks(session?: WorkoutSession | null) {
  const currentSessionId = session?.id ?? -1;

  const query = useLiveQuery(
    db
      .select({
        exerciseId: workoutSessionExercises.exerciseId,
        exerciseName: workoutSessionExercises.exerciseName,
        sessionId: workoutSessions.id,
        sessionStartedAt: workoutSessions.startedAt,
        reps: workoutSessionSets.reps,
        weight: workoutSessionSets.weight,
        weightUnit: workoutSessionExercises.weightUnit,
        setSortOrder: workoutSessionSets.sortOrder,
        setId: workoutSessionSets.id,
      })
      .from(workoutSessionSets)
      .innerJoin(
        workoutSessionExercises,
        eq(workoutSessionSets.sessionExerciseId, workoutSessionExercises.id),
      )
      .innerJoin(
        workoutSessions,
        eq(workoutSessionExercises.sessionId, workoutSessions.id),
      )
      .where(ne(workoutSessions.id, currentSessionId))
      .orderBy(
        desc(workoutSessions.startedAt),
        desc(workoutSessions.id),
        asc(workoutSessionSets.sortOrder),
        asc(workoutSessionSets.id),
      ),
    [currentSessionId],
  );

  return {
    ...query,
    data: query.data as LastExerciseMark[],
    isPending: !query.updatedAt && !query.error,
  };
}

export function useSessionMutations() {
  async function createSessionForNow() {
    const [session] = await db
      .insert(workoutSessions)
      .values({
        startedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: workoutSessions.id });

    if (!session) {
      throw new Error("No se pudo crear la sesión.");
    }

    return session.id;
  }

  async function updateSession(id: number, values: UpdateSessionValues) {
    const nextValues: Partial<typeof workoutSessions.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (values.startedAt) {
      nextValues.startedAt = values.startedAt;
    }

    if ("notes" in values) {
      nextValues.notes = values.notes?.trim() || null;
    }

    await db
      .update(workoutSessions)
      .set(nextValues)
      .where(eq(workoutSessions.id, id));
  }

  async function deleteSession(id: number) {
    await db.delete(workoutSessions).where(eq(workoutSessions.id, id));
  }

  async function addExerciseToSession(sessionId: number, exercise: Exercise) {
    const nextSortOrder = await getNextSessionExerciseSortOrder(sessionId);

    const [inserted] = await db
      .insert(workoutSessionExercises)
      .values({
        sessionId,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        exerciseMuscleGroup: exercise.muscleGroup,
        weightUnit: "kg",
        sortOrder: nextSortOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: workoutSessionExercises.id });

    if (!inserted) {
      throw new Error("No se pudo agregar el ejercicio.");
    }

    await db.insert(workoutSessionSets).values({
      sessionExerciseId: inserted.id,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await touchSession(sessionId);
  }

  async function removeSessionExercise(id: number) {
    const sessionExercise = await getSessionExercise(id);
    await db
      .delete(workoutSessionExercises)
      .where(eq(workoutSessionExercises.id, id));

    if (sessionExercise) {
      await touchSession(sessionExercise.sessionId);
    }
  }

  async function addSet(sessionExerciseId: number) {
    const sessionExercise = await getSessionExercise(sessionExerciseId);
    const nextSortOrder = await getNextSetSortOrder(sessionExerciseId);

    await db.insert(workoutSessionSets).values({
      sessionExerciseId,
      sortOrder: nextSortOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (sessionExercise) {
      await touchSession(sessionExercise.sessionId);
    }
  }

  async function updateSet(id: number, values: UpdateSetValues) {
    const set = await getSet(id);

    await db
      .update(workoutSessionSets)
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(eq(workoutSessionSets.id, id));

    if (!set) return;

    const sessionExercise = await getSessionExercise(set.sessionExerciseId);
    if (sessionExercise) {
      await touchSession(sessionExercise.sessionId);
    }
  }

  async function updateSessionExerciseWeightUnit(
    id: number,
    weightUnit: WeightUnit,
  ) {
    const sessionExercise = await getSessionExercise(id);

    await db
      .update(workoutSessionExercises)
      .set({
        weightUnit,
        updatedAt: new Date(),
      })
      .where(eq(workoutSessionExercises.id, id));

    if (sessionExercise) {
      await touchSession(sessionExercise.sessionId);
    }
  }

  async function deleteSet(id: number) {
    const set = await getSet(id);
    if (!set) return;

    const [{ setCount } = { setCount: 0 }] = await db
      .select({ setCount: count() })
      .from(workoutSessionSets)
      .where(eq(workoutSessionSets.sessionExerciseId, set.sessionExerciseId));

    if (setCount <= 1) return;

    await db.delete(workoutSessionSets).where(eq(workoutSessionSets.id, id));

    const sessionExercise = await getSessionExercise(set.sessionExerciseId);
    if (sessionExercise) {
      await touchSession(sessionExercise.sessionId);
    }
  }

  return {
    addExerciseToSession,
    addSet,
    createSessionForNow,
    deleteSession,
    deleteSet,
    removeSessionExercise,
    updateSession,
    updateSessionExerciseWeightUnit,
    updateSet,
  };
}

export function useSessionMuscleGroups() {
  const { data: sessionExerciseSearchIndex, ...query } =
    useSessionExerciseSearchIndex();
  const data = Object.entries(
    sessionExerciseSearchIndex,
  ).reduce<SessionMuscleGroupsBySessionId>(
    (accumulator, [sessionId, value]) => {
      accumulator[Number(sessionId)] = value.muscleGroups;
      return accumulator;
    },
    {},
  );

  return {
    ...query,
    data,
    isPending: !query.updatedAt && !query.error,
  };
}

export function useSessionExerciseSearchIndex() {
  const query = useLiveQuery(
    db
      .select({
        sessionId: workoutSessionExercises.sessionId,
        exerciseName: workoutSessionExercises.exerciseName,
        muscleGroup: workoutSessionExercises.exerciseMuscleGroup,
      })
      .from(workoutSessionExercises)
      .orderBy(
        asc(workoutSessionExercises.sessionId),
        asc(workoutSessionExercises.sortOrder),
        asc(workoutSessionExercises.id),
      ),
  );

  const data = query.data.reduce<SessionExerciseSearchIndex>(
    (accumulator, row) => {
      const sessionSearchData = accumulator[row.sessionId] ?? {
        exerciseNames: [],
        muscleGroups: [],
      };
      const exerciseName = row.exerciseName.trim();

      if (
        exerciseName &&
        !sessionSearchData.exerciseNames.includes(exerciseName)
      ) {
        sessionSearchData.exerciseNames.push(exerciseName);
      }

      if (
        isMuscleGroup(row.muscleGroup) &&
        !sessionSearchData.muscleGroups.includes(row.muscleGroup)
      ) {
        sessionSearchData.muscleGroups.push(row.muscleGroup);
      }

      accumulator[row.sessionId] = sessionSearchData;
      return accumulator;
    },
    {},
  );

  return {
    ...query,
    data,
    isPending: !query.updatedAt && !query.error,
  };
}

async function getNextSessionExerciseSortOrder(sessionId: number) {
  const [lastExercise] = await db
    .select({ sortOrder: workoutSessionExercises.sortOrder })
    .from(workoutSessionExercises)
    .where(eq(workoutSessionExercises.sessionId, sessionId))
    .orderBy(desc(workoutSessionExercises.sortOrder))
    .limit(1);

  return (lastExercise?.sortOrder ?? -1) + 1;
}

async function getNextSetSortOrder(sessionExerciseId: number) {
  const [lastSet] = await db
    .select({ sortOrder: workoutSessionSets.sortOrder })
    .from(workoutSessionSets)
    .where(eq(workoutSessionSets.sessionExerciseId, sessionExerciseId))
    .orderBy(desc(workoutSessionSets.sortOrder))
    .limit(1);

  return (lastSet?.sortOrder ?? -1) + 1;
}

async function getSessionExercise(id: number) {
  const [sessionExercise] = await db
    .select()
    .from(workoutSessionExercises)
    .where(eq(workoutSessionExercises.id, id))
    .limit(1);

  return sessionExercise;
}

async function getSet(id: number) {
  const [set] = await db
    .select()
    .from(workoutSessionSets)
    .where(eq(workoutSessionSets.id, id))
    .limit(1);

  return set;
}

async function touchSession(id: number) {
  await db
    .update(workoutSessions)
    .set({ updatedAt: new Date() })
    .where(eq(workoutSessions.id, id));
}

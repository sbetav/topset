import type { Exercise } from "@/hooks/use-exercises";
import type {
    LastExerciseMark,
    WeightUnit,
    WorkoutSession,
    WorkoutSessionExercise,
} from "@/hooks/use-sessions";
import { isWeightUnit } from "@/hooks/use-sessions";
import type { LastExerciseMarkSummary } from "./last-mark-details-sheet";

export function createLastMarksByExercise(rows: LastExerciseMark[]) {
  const lastMarksBySession = new Map<
    string,
    Map<number, LastExerciseMarkSummary>
  >();
  const lastMarks = new Map<string, LastExerciseMarkSummary>();

  rows.forEach((row) => {
    const key = getExerciseKey(row);
    const marksForExercise = lastMarksBySession.get(key) ?? new Map();
    const currentMark = marksForExercise.get(row.sessionId);

    if (!currentMark) {
      marksForExercise.set(row.sessionId, {
        sessionId: row.sessionId,
        sessionStartedAt: row.sessionStartedAt,
        weightUnit: isWeightUnit(row.weightUnit) ? row.weightUnit : "kg",
        sets: [row],
      });
      lastMarksBySession.set(key, marksForExercise);
      return;
    }

    currentMark.sets.push(row);
  });

  lastMarksBySession.forEach((marksForExercise, key) => {
    const latestCompletedMark = Array.from(marksForExercise.values()).find(
      hasLastMarkCompletedSet,
    );

    if (latestCompletedMark) {
      lastMarks.set(key, latestCompletedMark);
    }
  });

  return lastMarks;
}

export function getExerciseKey(
  exercise:
    | Pick<WorkoutSessionExercise | LastExerciseMark, "exerciseId" | "exerciseName">
    | Pick<Exercise, "id" | "name">,
) {
  const exerciseId = "exerciseId" in exercise ? exercise.exerciseId : exercise.id;
  const exerciseName =
    "exerciseName" in exercise ? exercise.exerciseName : exercise.name;

  return exerciseId
    ? `id:${exerciseId}`
    : `name:${exerciseName.trim().toLowerCase()}`;
}

export function sortSessionsByNewest(sessions: WorkoutSession[]) {
  return [...sessions].sort((left, right) => {
    const startedAtDiff = right.startedAt.getTime() - left.startedAt.getTime();

    if (startedAtDiff !== 0) {
      return startedAtDiff;
    }

    return right.id - left.id;
  });
}

export function createSessionDisplayIndexById(sessions: WorkoutSession[]) {
  const totalSessions = sessions.length;

  return sessions.reduce((displayIndexById, session, index) => {
    displayIndexById.set(session.id, totalSessions - index);
    return displayIndexById;
  }, new Map<number, number>());
}

export function formatLastMarkSets(
  sets: LastExerciseMark[],
  weightUnit: WeightUnit,
) {
  return sets
    .map((set) => {
      return formatLastMarkSet(set, weightUnit);
    })
    .join(", ");
}

export function formatLastMarkSet(
  set: LastExerciseMark,
  weightUnit: WeightUnit,
) {
  const reps = set.reps ?? "-";
  const weight = set.weight ?? "-";
  return `${reps} reps x ${weight} ${weightUnit.toUpperCase()}`;
}

export function hasLastMarkCompletedSet(mark?: LastExerciseMarkSummary) {
  return (
    mark?.sets.some((set) => set.reps !== null && set.weight !== null) ?? false
  );
}

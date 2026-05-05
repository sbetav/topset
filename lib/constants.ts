export const APP_NAME = "Topset";

export const MUSCLE_GROUPS = [
  "chest",
  "shoulders",
  "triceps",
  "biceps",
  "back",
  "legs",
  "core",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Pecho",
  shoulders: "Hombros",
  triceps: "Tríceps",
  biceps: "Bíceps",
  back: "Espalda",
  legs: "Piernas",
  core: "Core",
};

export function isMuscleGroup(value: unknown): value is MuscleGroup {
  return MUSCLE_GROUPS.includes(value as MuscleGroup);
}

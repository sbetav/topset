import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MUSCLE_GROUPS, MuscleGroup } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMuscleGroup(value: unknown): value is MuscleGroup {
  return MUSCLE_GROUPS.includes(value as MuscleGroup);
}

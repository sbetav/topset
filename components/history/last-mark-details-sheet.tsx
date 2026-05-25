import { Text } from "@/components/ui/text";
import type { LastExerciseMark, WeightUnit } from "@/hooks/use-sessions";
import dayjs from "dayjs";
import { BottomSheet } from "heroui-native/bottom-sheet";
import { Button } from "heroui-native/button";
import { Label } from "heroui-native/label";
import React from "react";
import { View } from "react-native";

export type LastExerciseMarkSummary = {
  sessionId: number;
  sessionStartedAt: Date;
  weightUnit: WeightUnit;
  sets: LastExerciseMark[];
};

type LastMarkDetailsSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  exerciseName?: string;
  mark?: LastExerciseMarkSummary;
};

export function LastMarkDetailsSheet({
  isOpen,
  onOpenChange,
  exerciseName,
  mark,
}: LastMarkDetailsSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View className="gap-4 pb-4">
            <View>
              <BottomSheet.Title>
                {exerciseName ?? "Ejercicio"}
              </BottomSheet.Title>
              <BottomSheet.Description>
                Última marca ·{" "}
                {mark
                  ? dayjs(mark.sessionStartedAt).format("MMMM D YYYY")
                  : "-"}
              </BottomSheet.Description>
            </View>

            {mark ? (
              <View className="gap-2">
                <View className="flex-row items-center gap-2 px-1">
                  <View className="w-6" />
                  <Label className="flex-1">Reps</Label>
                  <View className="flex-1">
                    <Label>Peso</Label>
                  </View>
                </View>
                {mark.sets.map((set, index) => (
                  <View key={set.setId} className="flex-row items-center gap-2">
                    <View className="w-6">
                      <Text className="text-muted text-sm font-medium text-center">
                        x{index + 1}
                      </Text>
                    </View>
                    <ReadOnlySetValue value={set.reps} className="flex-1" />
                    <ReadOnlySetValue
                      value={set.weight}
                      suffix={mark.weightUnit.toUpperCase()}
                      className="flex-1"
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-sm text-muted">
                No hay datos de sesiones anteriores para este ejercicio.
              </Text>
            )}
          </View>
          <Button
            variant="secondary"
            className="mt-2"
            onPress={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

function ReadOnlySetValue({
  value,
  suffix,
  className,
}: {
  value: number | null;
  suffix?: string;
  className?: string;
}) {
  return (
    <View
      className={`rounded-2xl border border-border bg-background/40 px-4 py-3 ${className ?? ""}`}
    >
      <Text className="text-sm text-foreground">
        {value ?? "--"}
        {value !== null && suffix ? ` ${suffix}` : ""}
      </Text>
    </View>
  );
}

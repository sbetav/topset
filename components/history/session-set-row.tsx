import { Icon } from "@/components/ui/icon";
import { type WorkoutSessionSet } from "@/hooks/use-sessions";
import { Input } from "heroui-native/input";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { MinusIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "../ui/text";

type SessionSetRowProps = {
  set: WorkoutSessionSet;
  index: number;
  canDelete?: boolean;
  onUpdateSet: (
    id: number,
    values: {
      reps?: number | null;
      weight?: number | null;
    },
  ) => void;
  onDeleteSet: (id: number) => void;
};

export function SessionSetRow({
  set,
  index,
  canDelete = true,
  onUpdateSet,
  onDeleteSet,
}: SessionSetRowProps) {
  const [reps, setReps] = useState(formatNullableNumber(set.reps));
  const [weight, setWeight] = useState(formatNullableNumber(set.weight));

  useEffect(() => {
    setReps(formatNullableNumber(set.reps));
    setWeight(formatNullableNumber(set.weight));
  }, [set.id, set.reps, set.weight]);

  function handleRepsBlur() {
    onUpdateSet(set.id, { reps: parseInteger(reps) });
  }

  function handleWeightBlur() {
    onUpdateSet(set.id, { weight: parseDecimal(weight) });
  }

  return (
    <View className="flex-row items-center gap-2">
      <View className="w-6 ">
        <Text className="text-muted text-sm font-medium text-center">
          x{index + 1}
        </Text>
      </View>
      <Input
        value={reps}
        onChangeText={setReps}
        onBlur={handleRepsBlur}
        keyboardType="number-pad"
        placeholder="--"
        className="flex-1"
      />

      <Input
        value={weight}
        onChangeText={setWeight}
        onBlur={handleWeightBlur}
        keyboardType="decimal-pad"
        placeholder="--"
        className="flex-1"
      />

      {canDelete ? (
        <PressableFeedback
          onPress={() => onDeleteSet(set.id)}
          className="bg-background border border-border items-center justify-center rounded-full size-5"
        >
          <Icon
            as={MinusIcon}
            className="text-muted/50 dark:text-muted"
            weight="bold"
            size={12}
          />
        </PressableFeedback>
      ) : (
        <View className="size-5" />
      )}
    </View>
  );
}

function formatNullableNumber(value: number | null) {
  return value === null ? "" : String(value);
}

function parseInteger(value: string) {
  const parsedValue = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function parseDecimal(value: string) {
  const parsedValue = Number(value.trim().replace(",", "."));
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

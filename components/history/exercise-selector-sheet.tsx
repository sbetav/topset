import {
    createLastMarksByExercise,
    formatLastMarkSet,
    getExerciseKey,
} from "@/components/history/session-utils";
import Card from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { Exercise } from "@/hooks/use-exercises";
import { useExercises } from "@/hooks/use-exercises";
import { useKeyboard } from "@/hooks/use-keyboard";
import { useLastExerciseMarks } from "@/hooks/use-sessions";
import { type MuscleGroup, MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { cn, isMuscleGroup } from "@/lib/utils";
import { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomSheetAwareHandlers, useThemeColor } from "heroui-native";
import { BottomSheet } from "heroui-native/bottom-sheet";
import { Chip } from "heroui-native/chip";
import { Input } from "heroui-native/input";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { ScrollShadow } from "heroui-native/scroll-shadow";
import { TextField } from "heroui-native/text-field";
import {
    BarbellIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon,
} from "phosphor-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Keyboard, TextInput, View } from "react-native";
import { MuscleGroupPicker } from "../exercises/muscle-group-picker";
import { Empty } from "../ui/empty";

type ExerciseSelectorSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectExercise: (exercise: Exercise) => void;
  selectedExerciseIds: Set<number>;
  onSelectSelectedExercises: (id: number) => void;
};

export function ExerciseSelectorSheet(props: ExerciseSelectorSheetProps) {
  const snapPoints = useMemo(() => ["65%", "90%"], []);

  return (
    <BottomSheet
      isOpen={props.isOpen}
      onOpenChange={(open) => {
        if (!open) Keyboard.dismiss();
        props.onOpenChange(open);
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={snapPoints}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full pt-26 pb-2"
          keyboardBehavior="extend"
        >
          <SheetInner {...props} />
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

const SheetInner = ({
  isOpen,
  onOpenChange,
  onSelectExercise,
  selectedExerciseIds,
  onSelectSelectedExercises,
}: ExerciseSelectorSheetProps) => {
  const overlayColor = useThemeColor("overlay");

  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | null>(null);

  const searchInputRef = useRef<TextInput>(null);
  const { isOpen: isKeyboardOpen } = useKeyboard({
    enabled: isOpen,
    onOpen: () => snapToIndex(1),
    onClose: () => {
      searchInputRef.current?.blur();
    },
  });

  const { onFocus, onBlur } = useBottomSheetAwareHandlers();
  const { data: exercises, isPending } = useExercises({
    search,
    muscleGroup: muscleFilter,
  });
  const { data: lastExerciseMarkRows } = useLastExerciseMarks();
  const lastMarksByExercise = useMemo(
    () => createLastMarksByExercise(lastExerciseMarkRows),
    [lastExerciseMarkRows],
  );

  const { snapToIndex } = useBottomSheet();

  const handleSelectExercise = useCallback(
    (exercise: Exercise) => {
      onSelectExercise(exercise);
      setSearch("");
      setMuscleFilter(null);
      onOpenChange(false);
    },
    [onSelectExercise, onOpenChange],
  );

  return (
    <>
      <View className="absolute top-0 left-0 right-0 px-5 pt-2 gap-3">
        <TextField>
          <View className="w-full flex-row items-center">
            <Input
              ref={searchInputRef}
              variant="secondary"
              value={search}
              onChangeText={setSearch}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Buscar ejercicio"
              autoCapitalize="none"
              autoCorrect={false}
              className="flex-1 px-10"
            />
            <Icon
              as={MagnifyingGlassIcon}
              size={18}
              className="absolute left-3.5 text-muted"
            />
          </View>
        </TextField>
        <MuscleGroupPicker
          value={muscleFilter}
          onChange={setMuscleFilter}
          scrollShadowColor={overlayColor}
          gestureHandler
        />
      </View>

      <ScrollShadow
        LinearGradientComponent={LinearGradient}
        color={overlayColor}
        className="flex-1"
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pt-3 gap-3 flex-1"
          keyboardShouldPersistTaps="handled"
        >
          {exercises.map((exercise) => {
            const isSelected = selectedExerciseIds.has(exercise.id);
            const lastMark = lastMarksByExercise.get(getExerciseKey(exercise));

            return (
              <PressableFeedback
                key={exercise.id}
                onPress={() => {
                  if (isKeyboardOpen) {
                    Keyboard.dismiss();
                    return;
                  }
                  if (isSelected) {
                    onSelectSelectedExercises(exercise.id);
                  } else {
                    handleSelectExercise(exercise);
                  }
                }}
              >
                <Card
                  variant="secondary"
                  className={cn(
                    "gap-1 flex-row items-center border border-surface-secondary justify-between",
                    {
                      "bg-success/8 border-success/40": isSelected,
                    },
                  )}
                >
                  <View>
                    <View className="flex-row items-center gap-1.5">
                      <Text className="font-semibold">{exercise.name}</Text>
                      <Chip variant="soft" size="sm" className="mt-0.5">
                        {isMuscleGroup(exercise.muscleGroup)
                          ? MUSCLE_GROUP_LABELS[exercise.muscleGroup]
                          : "Sin grupo muscular"}
                      </Chip>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm text-muted mt-px">
                        {lastMark
                          ? `${dayjs(lastMark.sessionStartedAt).format("MMMM D YYYY")} · ${formatLastMarkSet(lastMark.sets[0], lastMark.weightUnit)}`
                          : "Sin datos aún"}
                      </Text>
                    </View>
                  </View>

                  <Icon
                    as={isSelected ? CheckIcon : PlusCircleIcon}
                    size={isSelected ? 18 : 26}
                    weight={isSelected ? "bold" : "regular"}
                    className={cn("text-muted/40", {
                      "text-success": isSelected,
                    })}
                  />
                </Card>
              </PressableFeedback>
            );
          })}

          {!isPending && exercises.length === 0 ? (
            <Empty className="bg-background/40">
              <Empty.Header>
                <Empty.Media>
                  <Icon as={BarbellIcon} size={24} className="text-muted" />
                </Empty.Media>
                <Empty.Title>No se encontraron ejercicios</Empty.Title>
                <Empty.Description>
                  {!search && !muscleFilter
                    ? "Todos los ejercicios disponibles ya están en la sesión."
                    : search && muscleFilter
                      ? "No se encontraron ejercicios con esos criterios."
                      : search
                        ? "No encontramos ejercicios con ese nombre."
                        : "No hay ejercicios en este grupo muscular."}
                </Empty.Description>
              </Empty.Header>
            </Empty>
          ) : null}
        </BottomSheetScrollView>
      </ScrollShadow>
    </>
  );
};

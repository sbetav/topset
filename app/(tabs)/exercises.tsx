import DeleteExerciseDialog from "@/components/exercises/delete-exercise-dialog";
import ExerciseDetailsSheet from "@/components/exercises/exercise-details-sheet";
import { MuscleGroupPicker } from "@/components/exercises/muscle-group-picker";
import {
    createLastMarksByExercise,
    formatLastMarkSet,
    getExerciseKey,
} from "@/components/history/session-utils";
import {
    FlashListScreenContainer,
    ScreenContainer,
} from "@/components/screen-container";
import Card from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
    Exercise,
    useExerciseMutations,
    useExercises,
} from "@/hooks/use-exercises";
import { useLastExerciseMarks } from "@/hooks/use-sessions";
import { type MuscleGroup, MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { isMuscleGroup } from "@/lib/utils";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Button } from "heroui-native/button";
import { Chip } from "heroui-native/chip";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { ScrollShadow } from "heroui-native/scroll-shadow";
import { SearchField } from "heroui-native/search-field";
import { BarbellIcon, CaretRightIcon, PlusIcon } from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";

const Exercises = () => {
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: exercises, isPending: isLoadingExercises } = useExercises({
    search,
    muscleGroup: muscleFilter,
  });
  const { data: lastExerciseMarkRows } = useLastExerciseMarks();
  const { deleteExercise } = useExerciseMutations();
  const lastMarksByExercise = useMemo(
    () => createLastMarksByExercise(lastExerciseMarkRows),
    [lastExerciseMarkRows],
  );

  function handleOpenExercise(exercise: Exercise) {
    Keyboard.dismiss();
    setSelectedExercise(exercise);
    setIsSheetOpen(true);
  }

  function handleEditExercise() {
    if (!selectedExercise) return;

    setIsSheetOpen(false);
    setTimeout(() => {
      router.push({
        pathname: "/exercise",
        params: { id: String(selectedExercise.id) },
      });
    }, 100);
  }

  async function handleDeleteExercise() {
    if (!selectedExercise) return;

    await deleteExercise(selectedExercise.id);
    setIsDeleteDialogOpen(false);
    setIsSheetOpen(false);
    setSelectedExercise(null);
  }

  return (
    <View className="flex-1">
      <Pressable onPress={Keyboard.dismiss}>
        <ScreenContainer className="gap-4 pb-0 mb-3">
          <View className="flex-row justify-between">
            <Text className="font-semibold text-2xl tracking-tight">
              Ejercicios
            </Text>
            <Button size="sm" onPress={() => router.push("/exercise")}>
              <Icon as={PlusIcon} className="text-accent-foreground" />
              <Button.Label>Nuevo</Button.Label>
            </Button>
          </View>

          <SearchField value={search} onChange={setSearch}>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Buscar ejercicio" />
              {search ? <SearchField.ClearButton /> : null}
            </SearchField.Group>
          </SearchField>

          <MuscleGroupPicker
            value={muscleFilter}
            onChange={setMuscleFilter}
            variant="horizontal"
          />
        </ScreenContainer>
      </Pressable>

      <ScrollShadow
        LinearGradientComponent={LinearGradient}
        className="flex-1"
        size={35}
      >
        <FlashListScreenContainer
          data={exercises}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={80}
          contentContainerClassName="pt-1"
          ListEmptyComponent={
            isLoadingExercises ? null : (
              <Empty className="mx-px">
                <Empty.Header>
                  <Empty.Media>
                    <Icon as={BarbellIcon} size={24} className="text-muted" />
                  </Empty.Media>
                  <Empty.Title>No hay ejercicios</Empty.Title>
                  <Empty.Description>
                    {!search && !muscleFilter
                      ? "Crea tu primer ejercicio."
                      : search && muscleFilter
                        ? "No se encontraron ejercicios con esos criterios."
                        : search
                          ? "No se encontraron ejercicios con ese nombre."
                          : "No hay ejercicios en este grupo muscular."}
                  </Empty.Description>
                </Empty.Header>
                <Empty.Content>
                  <Button
                    size="sm"
                    variant="secondary"
                    onPress={() => router.push("/exercise")}
                  >
                    <Icon as={PlusIcon} className="text-accent" />
                    <Button.Label>Nuevo</Button.Label>
                  </Button>
                </Empty.Content>
              </Empty>
            )
          }
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => {
            const lastMark = lastMarksByExercise.get(getExerciseKey(item));

            return (
              <PressableFeedback
                onPress={() => handleOpenExercise(item)}
                className="p-px"
              >
                <Card className="flex-row items-center justify-between">
                  <View>
                    <View className="flex-row items-center gap-1.5">
                      <Text className="font-semibold">{item.name}</Text>
                      <Chip variant="soft" size="sm" className="mt-0.5">
                        {isMuscleGroup(item.muscleGroup)
                          ? MUSCLE_GROUP_LABELS[item.muscleGroup]
                          : "Sin grupo muscular"}
                      </Chip>
                    </View>
                    <Text className="text-sm text-muted mt-px">
                      {lastMark
                        ? `${dayjs(lastMark.sessionStartedAt).format("MMMM D YYYY")} • ${formatLastMarkSet(lastMark.sets[0], lastMark.weightUnit)}`
                        : "Sin datos aún"}
                    </Text>
                  </View>
                  <Icon
                    as={CaretRightIcon}
                    size={16}
                    weight="bold"
                    className="text-muted"
                  />
                </Card>
              </PressableFeedback>
            );
          }}
        />
      </ScrollShadow>

      <ExerciseDetailsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        handleDeleteExercise={() => {
          setIsSheetOpen(false);
          setTimeout(() => {
            setIsDeleteDialogOpen(true);
          }, 150);
        }}
        handleEditExercise={handleEditExercise}
        selectedExercise={selectedExercise}
      />
      <DeleteExerciseDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        handleDeleteExercise={handleDeleteExercise}
      />
    </View>
  );
};

export default Exercises;

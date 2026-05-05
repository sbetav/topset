import DeleteExerciseDialog from "@/components/exercises/delete-exercise-dialog";
import ExerciseDetailsSheet from "@/components/exercises/exercise-details-sheet";
import { FlatListScreenContainer } from "@/components/screen-container";
import Card from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
    Exercise,
    useExerciseMutations,
    useExercises,
} from "@/hooks/use-exercises";
import { useKeyboardBehavior } from "@/hooks/use-keyboard-behavior";
import { isMuscleGroup, MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { router } from "expo-router";
import { Button } from "heroui-native/button";
import { Chip } from "heroui-native/chip";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { SearchField } from "heroui-native/search-field";
import { BarbellIcon, CaretRightIcon, PlusIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Keyboard, KeyboardAvoidingView, View } from "react-native";

const Exercises = () => {
  const behavior = useKeyboardBehavior();
  const [search, setSearch] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: exercises, isPending: isLoadingExercises } =
    useExercises(search);
  const { deleteExercise } = useExerciseMutations();

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
    <KeyboardAvoidingView behavior={behavior} className="flex-1">
      <FlatListScreenContainer
        data={exercises}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-4 pb-24"
        ListHeaderComponent={
          <View className="gap-4 mx-px">
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
          </View>
        }
        ListEmptyComponent={
          isLoadingExercises ? null : (
            <Empty className="bg-background mx-px">
              <Empty.Header>
                <Empty.Media>
                  <Icon as={BarbellIcon} size={24} className="text-muted" />
                </Empty.Media>
                <Empty.Title>No hay ejercicios</Empty.Title>
                <Empty.Description>
                  {search
                    ? "No encontramos ejercicios con ese nombre."
                    : "Crea tu primer ejercicio para empezar a entrenar."}
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
        renderItem={({ item }) => (
          <PressableFeedback
            onPress={() => handleOpenExercise(item)}
            className="p-px"
          >
            <Card className="flex-row items-center justify-between">
              <View>
                <Text className="font-semibold">{item.name}</Text>
                <View className="flex-row items-center gap-2">
                  <Chip variant="soft" size="sm" className="mt-1">
                    {isMuscleGroup(item.muscleGroup)
                      ? MUSCLE_GROUP_LABELS[item.muscleGroup]
                      : "Sin grupo muscular"}
                  </Chip>
                  <Text className="text-muted text-sm mt-px">&bull;</Text>
                  <Text className="text-sm text-muted mt-px">
                    Sin datos aún
                  </Text>
                </View>
              </View>
              <Icon
                as={CaretRightIcon}
                size={16}
                weight="bold"
                className="text-muted"
              />
            </Card>
          </PressableFeedback>
        )}
      />

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
    </KeyboardAvoidingView>
  );
};

export default Exercises;

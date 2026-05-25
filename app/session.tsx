import { DeleteSessionDialog } from "@/components/history/delete-session-dialog";
import { DeleteSessionExerciseDialog } from "@/components/history/delete-session-exercise-dialog";
import { ExerciseSelectorSheet } from "@/components/history/exercise-selector-sheet";
import {
  LastMarkDetailsSheet,
    type LastExerciseMarkSummary,
} from "@/components/history/last-mark-details-sheet";
import { SessionSetRow } from "@/components/history/session-set-row";
import {
  createSessionDisplayIndexById,
  createLastMarksByExercise,
  formatLastMarkSet,
  getExerciseKey,
  hasLastMarkCompletedSet,
  sortSessionsByNewest,
} from "@/components/history/session-utils";
import { ScrollableScreenContainer } from "@/components/screen-container";
import Card from "@/components/ui/card";
import { DateTimeField } from "@/components/ui/date-time-field";
import { Empty } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Text } from "@/components/ui/text";
import {
    isWeightUnit,
    useLastExerciseMarks,
    useSession,
    useSessionExercises,
    useSessionMutations,
    useSessionSets,
    useSessions,
    type WorkoutSessionExercise,
    type WorkoutSessionSet,
} from "@/hooks/use-sessions";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { isMuscleGroup } from "@/lib/utils";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native/button";
import { Chip } from "heroui-native/chip";
import { Label } from "heroui-native/label";
import { Menu } from "heroui-native/menu";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { Select } from "heroui-native/select";
import {
    BarbellIcon,
    CaretDownIcon,
    CaretRightIcon,
    DotsThreeVerticalIcon,
    PlusIcon,
    TrashIcon,
} from "phosphor-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

const LAST_MARK_SHEET_CLOSE_DELAY_MS = 200;

const Session = () => {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;

  const parsedId = idParam ? Number(idParam) : null;
  const sessionId = parsedId && Number.isFinite(parsedId) ? parsedId : null;

  const { data: sessions } = useSessions();
  const { data: session } = useSession(sessionId);
  const { data: sessionExercises } = useSessionExercises(sessionId);
  const { data: sessionSets } = useSessionSets(sessionId);
  const { data: lastExerciseMarkRows } = useLastExerciseMarks(session);
  const {
    addExerciseToSession,
    addSet,
    deleteSession,
    deleteSet,
    removeSessionExercise,
    updateSession,
    updateSessionExerciseWeightUnit,
    updateSet,
  } = useSessionMutations();

  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] =
    useState(false);
  const [exerciseToDelete, setExerciseToDelete] =
    useState<WorkoutSessionExercise | null>(null);
  const [selectedLastMark, setSelectedLastMark] = useState<{
    exerciseName: string;
    mark: LastExerciseMarkSummary;
  } | null>(null);
  const [isLastMarkSheetOpen, setIsLastMarkSheetOpen] = useState(false);

  const setsByExerciseId = useMemo(
    () => groupSetsByExercise(sessionSets),
    [sessionSets],
  );
  const selectedExerciseIds = useMemo(
    () =>
      new Set(
        sessionExercises
          .map((sessionExercise) => sessionExercise.exerciseId)
          .filter((exerciseId): exerciseId is number => exerciseId !== null),
      ),
    [sessionExercises],
  );
  const sortedSessions = useMemo(() => sortSessionsByNewest(sessions), [sessions]);
  const sessionDisplayIndexById = useMemo(
    () => createSessionDisplayIndexById(sortedSessions),
    [sortedSessions],
  );
  const sessionDisplayIndex = sessionId
    ? sessionDisplayIndexById.get(sessionId)
    : undefined;
  const lastMarksByExercise = useMemo(
    () => createLastMarksByExercise(lastExerciseMarkRows),
    [lastExerciseMarkRows],
  );

  useEffect(() => {
    if (isLastMarkSheetOpen || !selectedLastMark) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSelectedLastMark(null);
    }, LAST_MARK_SHEET_CLOSE_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [isLastMarkSheetOpen, selectedLastMark]);

  function handleUpdateSessionDate(startedAt: Date) {
    if (!sessionId) return;
    void updateSession(sessionId, { startedAt });
  }

  async function handleDeleteSession() {
    if (!sessionId) return;

    await deleteSession(sessionId);
    setIsDeleteSessionDialogOpen(false);
    router.back();
  }

  async function handleDeleteSessionExercise() {
    if (!exerciseToDelete) return;

    await removeSessionExercise(exerciseToDelete.id);
    setExerciseToDelete(null);
  }

  return (
    <View className="flex-1">
      <ScreenHeader
        title={
          sessionDisplayIndex
            ? `Entrenamiento #${sessionDisplayIndex}`
            : "Entrenamiento"
        }
        right={
          session ? (
            <Menu>
              <Menu.Trigger className="p-1">
                <Icon
                  as={DotsThreeVerticalIcon}
                  size={20}
                  className="text-muted"
                />
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Overlay />
                <Menu.Content
                  presentation="popover"
                  width={160}
                  className="p-1"
                >
                  <Menu.Item
                    variant="danger"
                    onPress={() => setIsDeleteSessionDialogOpen(true)}
                  >
                    <Icon as={TrashIcon} size={16} className="text-danger" />
                    <Menu.ItemTitle className="text-sm">
                      Eliminar sesión
                    </Menu.ItemTitle>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Portal>
            </Menu>
          ) : null
        }
      />
      <ScrollableScreenContainer
        contentContainerClassName="gap-4"
        className="flex-1"
      >
        {session ? (
          <>
            <Card>
              <DateTimeField
                value={session.startedAt}
                onChange={handleUpdateSessionDate}
              />
            </Card>

            {sessionExercises.length === 0 ? (
              <Empty>
                <Empty.Header>
                  <Empty.Media>
                    <Icon as={BarbellIcon} size={24} className="text-muted" />
                  </Empty.Media>
                  <Empty.Title>Sin ejercicios</Empty.Title>
                  <Empty.Description>
                    Agrega ejercicios para registrar tus sets.
                  </Empty.Description>
                </Empty.Header>
                <Empty.Content>
                  <Button
                    size="sm"
                    onPress={() => setIsExerciseSelectorOpen(true)}
                  >
                    <Icon as={PlusIcon} className="text-accent-foreground" />
                    <Button.Label>Agregar ejercicio</Button.Label>
                  </Button>
                </Empty.Content>
              </Empty>
            ) : (
              <View className="gap-4">
                {sessionExercises.map((sessionExercise) => {
                  const sets = setsByExerciseId.get(sessionExercise.id) ?? [];
                  const weightUnit = isWeightUnit(sessionExercise.weightUnit)
                    ? sessionExercise.weightUnit
                    : "kg";
                  const lastMark = lastMarksByExercise.get(
                    getExerciseKey(sessionExercise),
                  );
                  const shouldShowLastMark = hasLastMarkCompletedSet(lastMark);
                  const weightUnitLabel = weightUnit.toUpperCase();
                  const selectedWeightUnit = {
                    value: weightUnit,
                    label: weightUnitLabel,
                  };

                  return (
                    <PressableFeedback
                      key={sessionExercise.id}
                      onLongPress={() => setExerciseToDelete(sessionExercise)}
                      className="p-px"
                    >
                      <Card className="gap-4 pb-5">
                        <View className="flex-row items-center justify-between gap-3">
                          <Text className="font-semibold text-lg">
                            {sessionExercise.exerciseName}
                          </Text>

                          <Chip variant="soft" size="sm" className="mt-1">
                            {isMuscleGroup(sessionExercise.exerciseMuscleGroup)
                              ? MUSCLE_GROUP_LABELS[
                                  sessionExercise.exerciseMuscleGroup
                                ]
                              : "Sin grupo muscular"}
                          </Chip>
                        </View>

                        {shouldShowLastMark && lastMark ? (
                          <PressableFeedback
                            onPress={() =>
                              lastMark
                                ? (setSelectedLastMark({
                                    exerciseName: sessionExercise.exerciseName,
                                    mark: lastMark,
                                  }),
                                  setIsLastMarkSheetOpen(true))
                                : null
                            }
                            className="flex-row items-center justify-between rounded-2xl border border-border bg-background/40 py-3 pl-4 pr-3"
                          >
                            <View>
                              <Text className="text-xs font-semibold">
                                Última marca
                              </Text>
                              <Text className="text-xs text-muted">
                                {dayjs(lastMark.sessionStartedAt).format(
                                  "MMMM D YYYY",
                                )}{" "}
                                &bull;{" "}
                                {formatLastMarkSet(
                                  lastMark.sets[0],
                                  lastMark.weightUnit,
                                )}
                              </Text>
                            </View>
                            <Icon
                              as={CaretRightIcon}
                              size={14}
                              weight="bold"
                              className="text-muted"
                            />
                          </PressableFeedback>
                        ) : null}

                        <View className="gap-2">
                          <View className="flex-row items-center gap-2">
                            <View className="w-6" />
                            <Label className="flex-1">Reps</Label>
                            <View className="flex-row items-center flex-1 gap-1.5">
                              <Label>Peso</Label>
                              <Select
                                value={selectedWeightUnit}
                                onValueChange={(value) => {
                                  if (!value || !isWeightUnit(value.value)) {
                                    return;
                                  }
                                  void updateSessionExerciseWeightUnit(
                                    sessionExercise.id,
                                    value.value,
                                  );
                                }}
                              >
                                <Select.Trigger asChild>
                                  <PressableFeedback className="flex-row bg-background/70 items-center gap-1 pl-2 mt-0.5 pr-1.5 py-0.5 pb-[3px]">
                                    <Text className="text-muted text-xs">
                                      {weightUnitLabel}
                                    </Text>
                                    <Icon
                                      as={CaretDownIcon}
                                      size={10}
                                      className="text-muted mt-px"
                                    />
                                  </PressableFeedback>
                                </Select.Trigger>
                                <Select.Portal>
                                  <Select.Overlay />
                                  <Select.Content
                                    presentation="popover"
                                    className="w-[100px] p-0! rounded-xl! "
                                  >
                                    <Select.Item
                                      value="kg"
                                      label="Kilogramos"
                                      className="px-3 py-1.5"
                                    >
                                      <Text className="text-sm">
                                        Kilogramos
                                      </Text>
                                    </Select.Item>
                                    <Select.Item
                                      value="lb"
                                      label="Libras"
                                      className="px-3 py-1.5 m-0"
                                    >
                                      <Text className="text-sm">Libras</Text>
                                    </Select.Item>
                                  </Select.Content>
                                </Select.Portal>
                              </Select>
                            </View>
                            <View className="w-5" />
                          </View>
                          {sets.map((set, index) => (
                            <SessionSetRow
                              key={set.id}
                              set={set}
                              index={index}
                              canDelete={index > 0}
                              onUpdateSet={(id, values) =>
                                void updateSet(id, values)
                              }
                              onDeleteSet={(id) => void deleteSet(id)}
                            />
                          ))}
                          <View className="flex-row items-center gap-2">
                            <View className="w-6" />
                            <PressableFeedback
                              onPress={() => void addSet(sessionExercise.id)}
                              className="flex-row items-center gap-2 justify-center border border-border border-dashed px-3 py-3 rounded-2xl bg-background/50 flex-1"
                            >
                              <Icon
                                as={PlusIcon}
                                weight="bold"
                                className="text-muted"
                              />
                              <Text className="text-muted text-sm font-medium">
                                Agregar serie
                              </Text>
                            </PressableFeedback>
                            <View className="w-5" />
                          </View>
                        </View>
                      </Card>
                    </PressableFeedback>
                  );
                })}

                <Button onPress={() => setIsExerciseSelectorOpen(true)}>
                  <Icon as={PlusIcon} className="text-accent-foreground" />
                  <Button.Label> Agregar ejercicio</Button.Label>
                </Button>
              </View>
            )}
          </>
        ) : null}
      </ScrollableScreenContainer>

      <ExerciseSelectorSheet
        isOpen={isExerciseSelectorOpen}
        onOpenChange={setIsExerciseSelectorOpen}
        selectedExerciseIds={selectedExerciseIds}
        onSelectExercise={(exercise) => {
          if (!sessionId) return;
          void addExerciseToSession(sessionId, exercise);
        }}
        onSelectSelectedExercises={(exerciseId) => {
          setExerciseToDelete(
            sessionExercises.find((se) => se.exerciseId === exerciseId) ?? null,
          );
        }}
      />
      <DeleteSessionDialog
        isOpen={isDeleteSessionDialogOpen}
        onOpenChange={setIsDeleteSessionDialogOpen}
        onDeleteSession={handleDeleteSession}
      />
      <DeleteSessionExerciseDialog
        isOpen={!!exerciseToDelete}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setExerciseToDelete(null);
          }
        }}
        onDelete={handleDeleteSessionExercise}
      />
      <LastMarkDetailsSheet
        isOpen={isLastMarkSheetOpen}
        onOpenChange={setIsLastMarkSheetOpen}
        exerciseName={selectedLastMark?.exerciseName}
        mark={selectedLastMark?.mark}
      />
    </View>
  );
};

function groupSetsByExercise(sets: WorkoutSessionSet[]) {
  const groups = new Map<number, WorkoutSessionSet[]>();

  sets.forEach((set) => {
    const currentSets = groups.get(set.sessionExerciseId) ?? [];
    groups.set(set.sessionExerciseId, [...currentSets, set]);
  });

  return groups;
}

export default Session;

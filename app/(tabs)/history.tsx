import {
  createSessionDisplayIndexById,
  sortSessionsByNewest,
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
    type SessionExerciseSearchIndex,
    type WorkoutSession,
    useSessionExerciseSearchIndex,
    useSessionMutations,
    useSessions,
} from "@/hooks/use-sessions";
import { MUSCLE_GROUP_LABELS, type MuscleGroup } from "@/lib/constants";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, router } from "expo-router";
import { Button } from "heroui-native/button";
import { Chip } from "heroui-native/chip";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { ScrollShadow } from "heroui-native/scroll-shadow";
import { SearchField } from "heroui-native/search-field";
import {
    CaretRightIcon,
    ClockCounterClockwiseIcon,
    PlusIcon,
} from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";

type HistoryRow =
  | {
      type: "header";
      id: string;
      label: string;
    }
  | {
      type: "session";
      id: string;
      session: WorkoutSession;
      sessionDisplayIndex: number;
    };

const History = () => {
  const { data: sessions, isPending: isLoadingSessions } = useSessions();
  const { data: sessionSearchIndexById } = useSessionExerciseSearchIndex();
  const { createSessionForNow } = useSessionMutations();
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [search, setSearch] = useState("");
  const searchValue = normalizeSearch(search);
  const sortedSessions = useMemo(
    () => sortSessionsByNewest(sessions),
    [sessions],
  );
  const sessionDisplayIndexById = useMemo(
    () => createSessionDisplayIndexById(sortedSessions),
    [sortedSessions],
  );
  const filteredSessions = useMemo(
    () =>
      filterSessionsBySearch(
        sortedSessions,
        sessionSearchIndexById,
        searchValue,
      ),
    [searchValue, sessionSearchIndexById, sortedSessions],
  );
  const rows = useMemo(
    () => createHistoryRows(filteredSessions, sessionDisplayIndexById),
    [filteredSessions, sessionDisplayIndexById],
  );

  async function handleCreateSession() {
    setIsCreatingSession(true);

    try {
      const sessionId = await createSessionForNow();
      router.push(getSessionHref(sessionId));
    } finally {
      setIsCreatingSession(false);
    }
  }

  return (
    <View className="flex-1">
      <Pressable onPress={Keyboard.dismiss}>
        <ScreenContainer className="gap-4 pb-0 mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-2xl tracking-tight">
              Historial
            </Text>

            <Button
              size="sm"
              onPress={handleCreateSession}
              isDisabled={isCreatingSession}
            >
              <Icon
                as={PlusIcon}
                weight="bold"
                className="text-accent-foreground"
              />
              <Button.Label>Nueva</Button.Label>
            </Button>
          </View>

          <SearchField value={search} onChange={setSearch}>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Buscar ejercicio o grupo muscular" />
              {search ? <SearchField.ClearButton /> : null}
            </SearchField.Group>
          </SearchField>
        </ScreenContainer>
      </Pressable>

      <ScrollShadow
        LinearGradientComponent={LinearGradient}
        className="flex-1"
        size={35}
      >
        <FlashListScreenContainer
          data={rows}
          keyExtractor={(item) => item.id}
          estimatedItemSize={80}
          getItemType={(item) => item.type}
          contentContainerClassName="pt-0"
          ListEmptyComponent={
            isLoadingSessions ? null : (
              <Empty className="mx-px">
                <Empty.Header>
                  <Empty.Media>
                    <Icon
                      as={ClockCounterClockwiseIcon}
                      size={24}
                      className="text-muted"
                    />
                  </Empty.Media>
                  <Empty.Title>
                    {searchValue ? "Sin resultados" : "No hay sesiones"}
                  </Empty.Title>
                  <Empty.Description>
                    {searchValue
                      ? "Intenta buscar con otro ejercicio o grupo muscular."
                      : "Crea tu primera sesión para registrar ejercicios, sets y pesos."}
                  </Empty.Description>
                </Empty.Header>
                {searchValue ? null : (
                  <Empty.Content>
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={handleCreateSession}
                      isDisabled={isCreatingSession}
                    >
                      <Icon as={PlusIcon} className="text-accent" />
                      <Button.Label>Nueva sesión</Button.Label>
                    </Button>
                  </Empty.Content>
                )}
              </Empty>
            )
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return (
                <Text className="text-xs ml-1 font-semibold uppercase tracking-wide text-muted px-1 pt-2">
                  {item.label}
                </Text>
              );
            }

            return (
              <SessionListItem
                session={item.session}
                index={item.sessionDisplayIndex}
                muscleGroups={
                  sessionSearchIndexById[item.session.id]?.muscleGroups ?? []
                }
              />
            );
          }}
        />
      </ScrollShadow>
    </View>
  );
};

function SessionListItem({
  session,
  index,
  muscleGroups,
}: {
  session: WorkoutSession;
  index: number;
  muscleGroups: MuscleGroup[];
}) {
  return (
    <PressableFeedback
      onPress={() => router.push(getSessionHref(session.id))}
      className="p-px"
    >
      <Card className="flex-row items-center justify-between gap-4">
        <View className="flex-1">
          <Text className="font-semibold">Entrenamiento #{index}</Text>
          <View className="flex-row flex-wrap gap-1.5 mt-1">
            {muscleGroups.map((muscleGroup) => (
              <Chip key={muscleGroup} variant="soft" size="sm">
                {MUSCLE_GROUP_LABELS[muscleGroup]}
              </Chip>
            ))}
            {muscleGroups.length > 0 ? (
              <Text className="text-sm text-muted">•</Text>
            ) : null}
            <Text className="text-sm text-muted">
              {dayjs(session.startedAt).format("D MMMM YYYY")}
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
  );
}

function createHistoryRows(
  sessions: WorkoutSession[],
  sessionDisplayIndexById: Map<number, number>,
): HistoryRow[] {
  const rows: HistoryRow[] = [];
  let currentDateKey: string | null = null;

  sessions.forEach((session, index) => {
    const dateKey = dayjs(session.startedAt).format("YYYY-MM-DD");

    if (dateKey !== currentDateKey) {
      rows.push({
        type: "header",
        id: `header-${dateKey}`,
        label: formatGroupLabel(session.startedAt),
      });
      currentDateKey = dateKey;
    }

    rows.push({
      type: "session",
      id: `session-${session.id}`,
      session,
      sessionDisplayIndex:
        sessionDisplayIndexById.get(session.id) ?? sessions.length - index,
    });
  });

  return rows;
}

function filterSessionsBySearch(
  sessions: WorkoutSession[],
  sessionSearchIndexById: SessionExerciseSearchIndex,
  searchValue: string,
) {
  if (!searchValue) {
    return sessions;
  }

  return sessions.filter((session) => {
    const sessionSearchData = sessionSearchIndexById[session.id];

    if (!sessionSearchData) {
      return false;
    }

    const exerciseNameMatches = sessionSearchData.exerciseNames.some((name) =>
      normalizeSearch(name).includes(searchValue),
    );

    if (exerciseNameMatches) {
      return true;
    }

    return sessionSearchData.muscleGroups.some((muscleGroup) => {
      const groupLabel = MUSCLE_GROUP_LABELS[muscleGroup];

      return (
        normalizeSearch(muscleGroup).includes(searchValue) ||
        normalizeSearch(groupLabel).includes(searchValue)
      );
    });
  });
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatGroupLabel(value: Date) {
  const date = dayjs(value);
  const today = dayjs();
  const yesterday = today.subtract(1, "day");

  if (date.format("YYYY-MM-DD") === today.format("YYYY-MM-DD")) {
    return "Hoy";
  }

  if (date.format("YYYY-MM-DD") === yesterday.format("YYYY-MM-DD")) {
    return "Ayer";
  }

  return date.format("dddd D [de] MMMM");
}

function getSessionHref(id: number) {
  return `/session?id=${id}` as Href;
}

export default History;

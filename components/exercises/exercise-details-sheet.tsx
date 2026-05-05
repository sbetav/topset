import { Exercise } from "@/hooks/use-exercises";
import { BottomSheet } from "heroui-native/bottom-sheet";
import { Button } from "heroui-native/button";
import { ChartBarIcon, NotePencilIcon, TrashIcon } from "phosphor-react-native";
import React from "react";
import { View } from "react-native";
import { Empty } from "../ui/empty";
import { Icon } from "../ui/icon";

interface ExerciseDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleDeleteExercise: () => void;
  handleEditExercise: () => void;
  selectedExercise: Exercise | null;
}

const ExerciseDetailsSheet = ({
  isOpen,
  onOpenChange,
  handleDeleteExercise,
  handleEditExercise,
  selectedExercise,
}: ExerciseDetailsSheetProps) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View className="gap-5">
            <View>
              <BottomSheet.Title>
                {selectedExercise?.name ?? "Ejercicio"}
              </BottomSheet.Title>

              <BottomSheet.Description>
                Detalles del ejercicio.
              </BottomSheet.Description>
            </View>

            <Empty className="bg-background/40">
              <Empty.Header>
                <Empty.Media>
                  <Icon as={ChartBarIcon} size={24} className="text-muted" />
                </Empty.Media>
                <Empty.Title>No hay estadísticas aún</Empty.Title>
                <Empty.Description>
                  Podrás ver tu progreso aquí.
                </Empty.Description>
              </Empty.Header>
            </Empty>

            <View className="gap-3 flex-row justify-end pb-6 pt-1">
              <Button
                variant="danger-soft"
                size="sm"
                onPress={handleDeleteExercise}
              >
                <Icon as={TrashIcon} className="text-danger" />
                <Button.Label>Eliminar</Button.Label>
              </Button>
              <Button
                onPress={handleEditExercise}
                variant="secondary"
                size="sm"
              >
                <Icon as={NotePencilIcon} className="text-accent" />
                <Button.Label>Editar</Button.Label>
              </Button>
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};

export default ExerciseDetailsSheet;

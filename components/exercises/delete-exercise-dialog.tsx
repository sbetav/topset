import { Button } from "heroui-native/button";
import { Dialog } from "heroui-native/dialog";
import React from "react";
import { View } from "react-native";

interface DeleteExerciseDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleDeleteExercise: () => void;
}

const DeleteExerciseDialog = ({
  isOpen,
  onOpenChange,
  handleDeleteExercise,
}: DeleteExerciseDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <View className="mb-5 gap-1.5">
            <Dialog.Title>Eliminar ejercicio</Dialog.Title>
            <Dialog.Description>
              Esta acción no se puede deshacer.
            </Dialog.Description>
          </View>
          <View className="flex-row justify-end gap-3">
            <Button
              variant="tertiary"
              size="sm"
              onPress={() => onOpenChange(false)}
            >
              <Button.Label>Cancelar</Button.Label>
            </Button>
            <Button variant="danger" size="sm" onPress={handleDeleteExercise}>
              <Button.Label>Eliminar</Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default DeleteExerciseDialog;

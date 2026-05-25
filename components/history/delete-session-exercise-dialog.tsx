import { Button } from "heroui-native/button";
import { Dialog } from "heroui-native/dialog";
import React from "react";
import { View } from "react-native";

type DeleteSessionExerciseDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => void;
};

export function DeleteSessionExerciseDialog({
  isOpen,
  onOpenChange,
  onDelete,
}: DeleteSessionExerciseDialogProps) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <View className="gap-1 mb-5">
            <Dialog.Title>Eliminar ejercicio</Dialog.Title>
            <Dialog.Description>
              Este ejercicio y todas sus series se eliminarán de la sesión.
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
            <Button variant="danger" size="sm" onPress={onDelete}>
              <Button.Label>Eliminar</Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

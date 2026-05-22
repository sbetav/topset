import { useKeyboard } from "@/hooks/use-keyboard";
import { Button } from "heroui-native/button";
import { Dialog } from "heroui-native/dialog";
import { Input } from "heroui-native/input";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  const insetTop = insets.top + 100;

  const [confirmationText, setConfirmationText] = useState("");
  const isDeleteEnabled = confirmationText.trim() === "ELIMINAR";

  useKeyboard({
    onClose: () => onOpenChange(false),
  });

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
    }
  }, [isOpen]);

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal className="justify-start">
        <Dialog.Overlay />
        <Dialog.Content
          style={{
            marginTop: insetTop,
          }}
        >
          <View className="mb-5">
            <Dialog.Title>Eliminar ejercicio</Dialog.Title>
            <Dialog.Description>
              Escribe &quot;ELIMINAR&quot; para confirmar.
            </Dialog.Description>

            <Input
              variant="secondary"
              value={confirmationText}
              onChangeText={setConfirmationText}
              placeholder="ELIMINAR"
              autoCapitalize="characters"
              autoCorrect={false}
              className="mt-3"
              autoFocus
            />
          </View>
          <View className="flex-row justify-end gap-3">
            <Button
              variant="tertiary"
              size="sm"
              onPress={() => onOpenChange(false)}
            >
              <Button.Label>Cancelar</Button.Label>
            </Button>
            <Button
              variant="danger"
              size="sm"
              onPress={handleDeleteExercise}
              isDisabled={!isDeleteEnabled}
            >
              <Button.Label>Eliminar</Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default DeleteExerciseDialog;

import { ScrollableScreenContainer } from "@/components/screen-container";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useExercise, useExerciseMutations } from "@/hooks/use-exercises";
import { useKeyboardBehavior } from "@/hooks/use-keyboard-behavior";
import {
    type MuscleGroup,
    isMuscleGroup,
    MUSCLE_GROUP_LABELS,
    MUSCLE_GROUPS,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native/button";
import { FieldError } from "heroui-native/field-error";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { TagGroup } from "heroui-native/tag-group";
import { TextField } from "heroui-native/text-field";
import { ArrowLeftIcon } from "phosphor-react-native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, View } from "react-native";
import { z } from "zod";

const exerciseSchema = z.object({
  name: z.string().trim().min(1, "Ingresa un nombre para el ejercicio."),
  muscleGroup: z.enum(MUSCLE_GROUPS).nullable().optional(),
});

type ExerciseFormValues = z.infer<typeof exerciseSchema>;

const Exercise = () => {
  const behavior = useKeyboardBehavior();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const parsedId = idParam ? Number(idParam) : null;
  const exerciseId = parsedId && Number.isFinite(parsedId) ? parsedId : null;
  const isEditing = exerciseId !== null;
  const { data: exercise, isPending: isLoadingExercise } =
    useExercise(exerciseId);
  const { createExercise, updateExercise } = useExerciseMutations();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: "",
      muscleGroup: null,
    },
  });

  useEffect(() => {
    if (!exercise) return;

    reset({
      name: exercise.name,
      muscleGroup: isMuscleGroup(exercise.muscleGroup)
        ? exercise.muscleGroup
        : null,
    });
  }, [exercise, reset]);

  async function onSubmit(values: ExerciseFormValues) {
    if (exerciseId) {
      await updateExercise(exerciseId, values);
    } else {
      await createExercise(values);
    }

    router.back();
  }

  return (
    <KeyboardAvoidingView behavior={behavior} className="flex-1">
      <View className="flex-row items-center justify-center px-6 py-4 border-b border-border bg-surface dark:bg-surface/70">
        <PressableFeedback
          onPress={() => router.back()}
          className="absolute left-6"
        >
          <Icon as={ArrowLeftIcon} size={20} className="text-muted" />
        </PressableFeedback>
        <Text className="font-semibold">
          {isEditing ? "Editar ejercicio" : "Nuevo ejercicio"}
        </Text>
      </View>

      <ScrollableScreenContainer contentContainerClassName="gap-6 flex-1">
        <View className="gap-4 flex-1">
          {isEditing && isLoadingExercise ? null : (
            <>
              <Controller
                control={control}
                name="name"
                render={({
                  field: { onBlur, onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField isRequired isInvalid={!!error}>
                    <Label>Nombre</Label>
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Press de banca"
                      returnKeyType="done"
                    />
                    <FieldError>{error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="muscleGroup"
                render={({ field: { onChange, value } }) => (
                  <TagGroup
                    selectionMode="single"
                    selectedKeys={value ? new Set([value]) : new Set()}
                    onSelectionChange={(keys) => {
                      const [selectedKey] = Array.from(keys);
                      onChange(isMuscleGroup(selectedKey) ? selectedKey : null);
                    }}
                  >
                    <Label>Grupo muscular</Label>
                    <TagGroup.List>
                      {MUSCLE_GROUPS.map((muscleGroup: MuscleGroup) => (
                        <TagGroup.Item key={muscleGroup} id={muscleGroup}>
                          {MUSCLE_GROUP_LABELS[muscleGroup]}
                        </TagGroup.Item>
                      ))}
                    </TagGroup.List>
                  </TagGroup>
                )}
              />
            </>
          )}
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          isDisabled={
            isSubmitting || (isEditing && (!exercise || isLoadingExercise))
          }
        >
          <Button.Label>
            {isEditing ? "Guardar cambios" : "Crear ejercicio"}
          </Button.Label>
        </Button>
      </ScrollableScreenContainer>
    </KeyboardAvoidingView>
  );
};

export default Exercise;

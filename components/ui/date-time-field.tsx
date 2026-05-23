import RNDateTimePicker, {
    DateTimePickerAndroid,
    type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { useThemeColor } from "heroui-native";
import { inputClassNames } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { TextField } from "heroui-native/text-field";
import React, { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { Text } from "./text";

type PickerMode = "date" | "time";

type DateTimeFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
  dateLabel?: string;
  timeLabel?: string;
};

export function DateTimeField({
  value,
  onChange,
  dateLabel = "Fecha",
  timeLabel = "Hora",
}: DateTimeFieldProps) {
  const [accentColor] = useThemeColor(["accent"]);

  const [iosMode, setIosMode] = useState<PickerMode | null>(null);

  function handleOpenPicker(mode: PickerMode) {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value,
        mode,
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (event.type !== "set" || !selectedDate) return;

          onChange(mergeDateTime(value, selectedDate, mode));
        },
      });
      return;
    }

    setIosMode(mode);
  }

  function handleIosChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (event.type === "dismissed") {
      setIosMode(null);
      return;
    }

    if (!iosMode || !selectedDate) return;

    onChange(mergeDateTime(value, selectedDate, iosMode));
    setIosMode(null);
  }

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <TextField className="flex-1">
          <Label>{dateLabel}</Label>
          <DateTimeTrigger
            value={dayjs(value).format("MMMM D YYYY")}
            onPress={() => handleOpenPicker("date")}
          />
        </TextField>

        <TextField className="w-28">
          <Label>{timeLabel}</Label>
          <DateTimeTrigger
            value={dayjs(value).format("HH:mm")}
            onPress={() => handleOpenPicker("time")}
          />
        </TextField>
      </View>

      {Platform.OS !== "android" && iosMode ? (
        <RNDateTimePicker
          value={value}
          mode={iosMode}
          display="spinner"
          is24Hour
          onChange={handleIosChange}
          accentColor={accentColor}
        />
      ) : null}
    </View>
  );
}

function DateTimeTrigger({
  value,
  onPress,
}: {
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={inputClassNames.input({
        variant: "secondary",
        className: "justify-center",
      })}
      style={{
        borderCurve: "continuous",
      }}
    >
      <Text className="text-sm">{value}</Text>
    </Pressable>
  );
}

function mergeDateTime(
  currentValue: Date,
  selectedValue: Date,
  mode: PickerMode,
) {
  const nextValue = new Date(currentValue);

  if (mode === "date") {
    nextValue.setFullYear(
      selectedValue.getFullYear(),
      selectedValue.getMonth(),
      selectedValue.getDate(),
    );
    return nextValue;
  }

  nextValue.setHours(
    selectedValue.getHours(),
    selectedValue.getMinutes(),
    0,
    0,
  );
  return nextValue;
}

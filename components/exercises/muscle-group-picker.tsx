import { useScrollGradient } from "@/hooks/use-scroll-gradient";
import {
    ALL_MUSCLE_FILTER_ID,
    MUSCLE_GROUP_LABELS,
    MUSCLE_GROUPS,
    type MuscleGroup,
} from "@/lib/constants";
import { isMuscleGroup } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "heroui-native";
import { TagGroup } from "heroui-native/tag-group";
import { Animated, ScrollView, View } from "react-native";

interface MuscleGroupPickerProps {
  value: MuscleGroup | null;
  onChange: (value: MuscleGroup | null) => void;
  variant?: "horizontal" | "wrap";
  allLabel?: string;
}

export function MuscleGroupPicker({
  value,
  onChange,
  variant = "horizontal",
  allLabel = "Todos",
}: MuscleGroupPickerProps) {
  const { leftOpacity, rightOpacity, handleScroll } = useScrollGradient();
  const [background] = useThemeColor(["background"]);
  const tagGroup = (
    <TagGroup
      selectionMode="single"
      selectedKeys={new Set([value ?? ALL_MUSCLE_FILTER_ID])}
      onSelectionChange={(keys) => {
        const [key] = Array.from(keys);
        if (!key || key === ALL_MUSCLE_FILTER_ID) {
          onChange(null);
        } else if (isMuscleGroup(key)) {
          onChange(key);
        }
      }}
    >
      {variant === "horizontal" ? (
        <View className="relative">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Items allLabel={allLabel} />
          </ScrollView>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 40,
              opacity: leftOpacity,
            }}
          >
            <LinearGradient
              colors={[background, "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 40,
              opacity: rightOpacity,
            }}
          >
            <LinearGradient
              colors={["transparent", background]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </View>
      ) : (
        <TagGroup.List className="flex-row flex-wrap gap-2">
          <TagGroup.Item id={ALL_MUSCLE_FILTER_ID}>{allLabel}</TagGroup.Item>
          {MUSCLE_GROUPS.map((muscleGroup) => (
            <TagGroup.Item key={muscleGroup} id={muscleGroup}>
              {MUSCLE_GROUP_LABELS[muscleGroup]}
            </TagGroup.Item>
          ))}
        </TagGroup.List>
      )}
    </TagGroup>
  );

  return tagGroup;
}

function Items({ allLabel }: { allLabel: string }) {
  return (
    <TagGroup.List className="flex-row flex-nowrap gap-2">
      <TagGroup.Item id={ALL_MUSCLE_FILTER_ID}>{allLabel}</TagGroup.Item>
      {MUSCLE_GROUPS.map((muscleGroup) => (
        <TagGroup.Item key={muscleGroup} id={muscleGroup}>
          {MUSCLE_GROUP_LABELS[muscleGroup]}
        </TagGroup.Item>
      ))}
    </TagGroup.List>
  );
}

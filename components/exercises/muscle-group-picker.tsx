import {
    ALL_MUSCLE_FILTER_ID,
    MUSCLE_GROUP_LABELS,
    MUSCLE_GROUPS,
    type MuscleGroup,
} from "@/lib/constants";
import { isMuscleGroup } from "@/lib/utils";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollShadow } from "heroui-native/scroll-shadow";
import { TagGroup } from "heroui-native/tag-group";
import { ScrollView } from "react-native";
import { ScrollView as GHScrollView } from "react-native-gesture-handler";

interface MuscleGroupPickerProps {
  value: MuscleGroup | null;
  onChange: (value: MuscleGroup | null) => void;
  variant?: "horizontal" | "wrap";
  allLabel?: string;
  scrollShadowColor?: string;
  gestureHandler?: boolean;
}

export function MuscleGroupPicker({
  value,
  onChange,
  variant = "horizontal",
  allLabel = "Todos",
  scrollShadowColor,
  gestureHandler,
}: MuscleGroupPickerProps) {
  const ScrollComponent = gestureHandler ? GHScrollView : ScrollView;
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
        <ScrollShadow
          LinearGradientComponent={LinearGradient}
          orientation="horizontal"
          size={30}
          color={scrollShadowColor}
        >
          <ScrollComponent
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            <Items allLabel={allLabel} />
          </ScrollComponent>
        </ScrollShadow>
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

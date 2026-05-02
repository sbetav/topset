import { cn } from "@/lib/utils";
import {
    type Icon as PhosphorIcon,
    type IconProps as PhosphorIconProps,
} from "phosphor-react-native";
import type { ComponentProps } from "react";
import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import { withUniwind } from "uniwind";

type IconStyle = ViewStyle & Omit<TextStyle, "cursor">;

type IconImplProps = PhosphorIconProps & {
  as: PhosphorIcon;
};

function IconBase({
  as: IconComponent,
  color,
  size,
  style,
  ...props
}: IconImplProps) {
  const flattenedStyle = StyleSheet.flatten(style) as IconStyle | undefined;
  const {
    color: styledColor,
    height,
    width,
    ...restStyle
  } = flattenedStyle ?? {};
  const styledSize =
    typeof width === "number" || typeof width === "string"
      ? width
      : typeof height === "number" || typeof height === "string"
        ? height
        : undefined;

  return (
    <IconComponent
      {...props}
      color={
        color ?? (typeof styledColor === "string" ? styledColor : undefined)
      }
      size={size ?? styledSize ?? 14}
      style={restStyle}
    />
  );
}

const IconImpl = withUniwind(IconBase);

type IconProps = ComponentProps<typeof IconImpl>;

function Icon({ className, ...props }: IconProps) {
  return <IconImpl className={cn("text-foreground", className)} {...props} />;
}

export { Icon };

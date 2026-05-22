import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { Text } from "./text";

function EmptyRoot({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "w-full min-w-0 flex-col items-center justify-center gap-3 rounded-xl border bg-surface/40 border-dashed border-border px-8 py-14 pb-15",
        className,
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View
      className={cn("max-w-sm w-full flex-col items-center", className)}
      {...props}
    />
  );
}

function EmptyMedia({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "mb-3 aspect-square p-2.5 items-center justify-center rounded-lg bg-surface border border-border dark:border-0",
        className,
      )}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "text-center text-lg font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function EmptyDescription({
  className,
  ...props
}: ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-center text-sm text-muted", className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View
      className={cn(
        "w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-center",
        className,
      )}
      {...props}
    />
  );
}

const Empty = Object.assign(EmptyRoot, {
  Header: EmptyHeader,
  Media: EmptyMedia,
  Title: EmptyTitle,
  Description: EmptyDescription,
  Content: EmptyContent,
});

export { Empty };

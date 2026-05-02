import { cn } from "@/lib/utils";
import React from "react";
import { Text as RNText, TextProps } from "react-native";

const Text = ({ children, className, ...props }: TextProps) => {
  return (
    <RNText
      {...props}
      className={cn("text-foreground font-normal text-base", className)}
    >
      {children}
    </RNText>
  );
};

export { Text };

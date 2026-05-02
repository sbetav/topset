import { cn } from "@/lib/utils";
import { Surface, SurfaceRootProps } from "heroui-native/surface";
import React from "react";

const Card = ({ children, className, ...props }: SurfaceRootProps) => {
  return (
    <Surface className={cn("px-5 py-4 ", className)} {...props}>
      {children}
    </Surface>
  );
};

export default Card;

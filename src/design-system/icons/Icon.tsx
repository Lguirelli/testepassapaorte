import type { CSSProperties } from "react";
import { iconRegistry } from "./icon-registry";
import type { IconName, IconSizeToken } from "./icon.types";

const tokenSize: Record<IconSizeToken, string> = {
  xs: "var(--icon-size-xs)",
  sm: "var(--icon-size-sm)",
  md: "var(--icon-size-md)",
  lg: "var(--icon-size-lg)",
  xl: "var(--icon-size-xl)",
};

type IconProps = {
  name: IconName;
  size?: IconSizeToken | number;
  title?: string;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
};

export function Icon({ name, size = "md", title, className, style, strokeWidth }: IconProps) {
  const Glyph = iconRegistry[name];
  const resolvedSize = typeof size === "number" ? `${size}px` : tokenSize[size];

  return (
    <Glyph
      className={className}
      width={resolvedSize}
      height={resolvedSize}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      strokeWidth={strokeWidth}
      style={{ display: "inline-block", flex: "0 0 auto", color: "currentColor", ...style }}
    />
  );
}

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
  const symbol = iconRegistry[name];
  const resolvedSize = typeof size === "number" ? `${size}px` : tokenSize[size];
  const resolvedWeight = strokeWidth
    ? Math.min(700, Math.max(100, Math.round(strokeWidth * 180)))
    : 400;

  return (
    <span
      className={["material-symbols-outlined", "psn-material-icon", className].filter(Boolean).join(" ")}
      data-ui-icon="true"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      title={title}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        fontSize: resolvedSize,
        fontVariationSettings: `'FILL' 0, 'wght' ${resolvedWeight}, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
    >
      {symbol}
    </span>
  );
}

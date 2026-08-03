"use client"

type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone"

type IconSize = "xs" | "sm" | "md" | "lg" | "xl"

const SIZE_MAP: Record<IconSize, string> = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
  xl: "size-6",
}

interface PhosphorIconComponent {
  ({ className, weight, ...rest }: { className?: string; weight?: IconWeight; [key: string]: unknown }): React.ReactElement | null
}

interface IconProps {
  icon: PhosphorIconComponent
  size?: IconSize
  weight?: IconWeight
  className?: string
}

export function Icon({
  icon: IconComponent,
  size = "md",
  weight = "regular",
  className = "",
}: IconProps) {
  return (
    <IconComponent
      className={`${SIZE_MAP[size]} shrink-0 ${className}`}
      weight={weight}
    />
  )
}

"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

interface HoverCardContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null)

function useHoverCard() {
  const context = React.useContext(HoverCardContext)
  if (!context) {
    throw new Error("useHoverCard must be used within a <HoverCard />")
  }
  return context
}

function HoverCard({ children, ...props }: React.ComponentProps<"div">) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLElement>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  const handleMouseEnter = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setOpen(true), 200)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }, [])

  return (
    <HoverCardContext.Provider value={{ open, setOpen, triggerRef }}>
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  )
}

function HoverCardTrigger({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { triggerRef } = useHoverCard()

  return (
    <div
      ref={triggerRef as React.RefObject<HTMLDivElement>}
      data-slot="hover-card-trigger"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

function HoverCardContent({
  className,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "center" | "end"
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
}) {
  const { open } = useHoverCard()

  if (!open) return null

  return (
    <div
      data-slot="hover-card-content"
      role="tooltip"
      className={cn(
        "absolute z-50 rounded-xl border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-scale-in",
        side === "bottom" && "top-full mt-[var(--offset)]",
        side === "top" && "bottom-full mb-[var(--offset)]",
        side === "left" && "right-full mr-[var(--offset)]",
        side === "right" && "left-full ml-[var(--offset)]",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className
      )}
      style={{ "--offset": `${sideOffset}px` } as React.CSSProperties}
      {...props}
    />
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }

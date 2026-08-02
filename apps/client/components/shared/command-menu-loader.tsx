"use client"

import dynamic from "next/dynamic"
import { Button } from "@workspace/ui/components/button"

const CommandMenuDynamic = dynamic(
  () =>
    import("@/components/shared/command-menu").then((mod) => ({
      default: mod.CommandMenu,
    })),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Open command menu"
        className="text-muted-foreground"
      >
        <span className="text-xs">⌘</span>
      </Button>
    ),
  }
)

export function CommandMenu() {
  return <CommandMenuDynamic />
}

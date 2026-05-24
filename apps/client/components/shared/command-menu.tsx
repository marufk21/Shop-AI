"use client"

import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command"
import {
  House,
  SquaresFour,
  ChatCircle,
  Files,
  ChartBar,
  Storefront,
  Gear,
  Sun,
  Moon,
} from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const items = [
  { label: "Dashboard", url: "/admin", icon: House, group: "Pages" },
  {
    label: "Products",
    url: "/admin/products",
    icon: SquaresFour,
    group: "Pages",
  },
{ label: "Chatbot", url: "/admin/chatbot", icon: ChatCircle, group: "AI" },
  { label: "Documents", url: "/admin/documents", icon: Files, group: "Pages" },
  {
    label: "Analytics",
    url: "/admin/analytics",
    icon: ChartBar,
    group: "Pages",
  },
  { label: "Storefront", url: "/store", icon: Storefront, group: "Pages" },
  { label: "Settings", url: "/admin/settings", icon: Gear, group: "Pages" },
]

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {["Pages", "AI"].map((group) => (
          <CommandGroup key={group} heading={group}>
            {items
              .filter((item) => item.group === group)
              .map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => {
                    router.push(item.url)
                    setOpen(false)
                  }}
                >
                  <item.icon className="mr-2 size-4" />
                  {item.label}
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem
            onSelect={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "dark" ? (
              <Sun className="mr-2 size-4" />
            ) : (
              <Moon className="mr-2 size-4" />
            )}
            Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

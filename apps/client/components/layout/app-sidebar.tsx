"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  House,
  SquaresFour,
  Sparkle,
  ChatCircle,
  Files,
  ChartBar,
  Storefront,
  Gear,
  Question,
} from "@phosphor-icons/react"

const adminGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: House },
      { title: "Analytics", url: "/admin/analytics", icon: ChartBar },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Products", url: "/admin/products", icon: SquaresFour },
      { title: "Documents", url: "/admin/documents", icon: Files },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { title: "AI Generator", url: "/admin/ai-generator", icon: Sparkle },
      { title: "Chatbot", url: "/admin/chatbot", icon: ChatCircle },
    ],
  },
]

const footerItems = [
  { title: "Storefront", url: "/store", icon: Storefront },
  { title: "Settings", url: "/admin/settings", icon: Gear },
  { title: "Help", url: "/admin/help", icon: Question },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href="/admin">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                    <Sparkle className="size-4" weight="fill" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="font-heading font-semibold truncate">ShopAI</span>
                    <span className="text-xs text-muted-foreground truncate">Admin</span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {adminGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      render={
                        <Link href={item.url}>
                          <item.icon className="size-4 shrink-0" />
                          <span className="truncate group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={pathname === item.url}
                tooltip={item.title}
                render={
                  <Link href={item.url}>
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
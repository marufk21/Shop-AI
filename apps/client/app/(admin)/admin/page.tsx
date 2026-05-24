"use client"

import {
  Sparkle,
  ChatCircle,
  CurrencyDollar,
  TrendUp,
  SquaresFour,
  ArrowUpRight,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import Link from "next/link"

const stats = [
  {
    label: "AI Generations",
    value: "2,847",
    change: "+12.5%",
    icon: Sparkle,
  },
  {
    label: "Chatbot Queries",
    value: "1,423",
    change: "+8.2%",
    icon: ChatCircle,
  },
  {
    label: "Revenue",
    value: "$48,290",
    change: "+23.1%",
    icon: CurrencyDollar,
  },
  {
    label: "Products",
    value: "156",
    change: "+4",
    icon: SquaresFour,
  },
]

const activities = [
  {
    user: "Sarah Chen",
    action: "generated product descriptions for",
    target: "Summer Collection",
    time: "2 min ago",
    initials: "SC",
  },
  {
    user: "Alex Kim",
    action: "uploaded new document",
    target: "Shipping Policy v2",
    time: "18 min ago",
    initials: "AK",
  },
  {
    user: "Maria Lopez",
    action: "created product",
    target: "Leather Weekend Bag",
    time: "1 hour ago",
    initials: "ML",
  },
  {
    user: "James Wilson",
    action: "ran chatbot analytics report",
    target: "",
    time: "2 hours ago",
    initials: "JW",
  },
  {
    user: "Emma Davis",
    action: "updated inventory for",
    target: "12 products",
    time: "3 hours ago",
    initials: "ED",
  },
]

export default function AdminDashboard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your store and AI usage
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            render={
              <Link href="/admin/analytics">
                <TrendUp className="mr-1.5 size-3.5" />
                View Analytics
              </Link>
            }
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>AI Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-end gap-2">
              {[40, 65, 45, 80, 55, 70, 90, 75, 60, 85, 50, 72].map((h, i) => (
                <div
                  key={i}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                >
                  <div
                    className="w-full rounded-md bg-primary transition-all"
                    style={{ height: `${h}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-sm bg-primary" />
                <span className="text-muted-foreground">Token Usage</span>
              </div>
              <span className="font-medium">12,450 tokens today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((a, i) => (
              <div key={i}>
                <div className="flex items-start gap-3">
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">
                      {a.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{a.user}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      {a.target && (
                        <span className="font-medium">{a.target}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
                {i < activities.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              render={
                <Link href="/admin/products">
                  View all <ArrowUpRight className="ml-1 size-3.5" />
                </Link>
              }
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Minimal Desk Lamp", sales: 234, revenue: "$20,826" },
                { name: "Leather Notebook", sales: 187, revenue: "$6,358" },
                { name: "Mechanical Keyboard", sales: 156, revenue: "$23,244" },
                { name: "Ceramic Mug Set", sales: 142, revenue: "$7,384" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{p.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {p.sales} sold
                    </span>
                    <span className="text-sm font-medium">{p.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI Credit Usage</CardTitle>
            <Badge variant="secondary">This month</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Product Descriptions", value: 1240, pct: 45 },
                { label: "Chatbot Responses", value: 890, pct: 32 },
                { label: "SEO Titles", value: 420, pct: 15 },
                { label: "Ad Copy", value: 210, pct: 8 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.value} tokens
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

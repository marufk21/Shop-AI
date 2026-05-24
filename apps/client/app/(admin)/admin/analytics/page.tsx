"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
  TrendUp,
  TrendDown,
  ChatCircle,
  Sparkle,
  CurrencyDollar,
  Users,
  Download,
} from "@phosphor-icons/react"

const chartData = [
  { label: "Jan", tokens: 4200, queries: 380, revenue: 12000 },
  { label: "Feb", tokens: 4500, queries: 420, revenue: 14000 },
  { label: "Mar", tokens: 5100, queries: 480, revenue: 16000 },
  { label: "Apr", tokens: 5800, queries: 520, revenue: 18000 },
  { label: "May", tokens: 6200, queries: 590, revenue: 21000 },
  { label: "Jun", tokens: 5900, queries: 550, revenue: 19500 },
  { label: "Jul", tokens: 6800, queries: 620, revenue: 23000 },
  { label: "Aug", tokens: 7200, queries: 680, revenue: 25000 },
  { label: "Sep", tokens: 7800, queries: 710, revenue: 27000 },
  { label: "Oct", tokens: 8100, queries: 750, revenue: 29000 },
  { label: "Nov", tokens: 8500, queries: 800, revenue: 31000 },
  { label: "Dec", tokens: 9200, queries: 870, revenue: 34000 },
]

const topQueries = [
  { query: "shipping policy", count: 245, trend: "up" },
  { query: "return policy", count: 189, trend: "up" },
  { query: "product recommendations", count: 156, trend: "down" },
  { query: "order status", count: 134, trend: "up" },
  { query: "payment methods", count: 98, trend: "stable" },
  { query: "discount codes", count: 87, trend: "up" },
  { query: "size guide", count: 72, trend: "down" },
  { query: "gift wrapping", count: 54, trend: "stable" },
]

const aiUsage = [
  { type: "Product Descriptions", count: 1240, pct: 40 },
  { type: "Chatbot Responses", count: 890, pct: 29 },
  { type: "SEO Titles", count: 420, pct: 14 },
  { type: "Ad Copy", count: 210, pct: 7 },
  { type: "Social Captions", count: 180, pct: 6 },
  { type: "Meta Descriptions", count: 140, pct: 4 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d")

  const maxTokens = Math.max(...chartData.map((d) => d.tokens))

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track AI usage, chatbot performance, and engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d", "1y"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="xs"
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 size-3.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Chatbot Queries",
            value: "8,720",
            change: "+12.3%",
            icon: ChatCircle,
            trend: "up",
          },
          {
            label: "AI Tokens Used",
            value: "92.4K",
            change: "+18.7%",
            icon: Sparkle,
            trend: "up",
          },
          {
            label: "Revenue",
            value: "$34,200",
            change: "+8.1%",
            icon: CurrencyDollar,
            trend: "up",
          },
          {
            label: "Active Users",
            value: "1,892",
            change: "-2.4%",
            icon: Users,
            trend: "down",
          },
        ].map((stat) => (
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
                {stat.trend === "up" ? (
                  <TrendUp className="size-3 text-green-500" />
                ) : (
                  <TrendDown className="size-3 text-destructive" />
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Token & Query Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-1.5">
              {chartData.map((d) => {
                const height = (d.tokens / maxTokens) * 100
                return (
                  <div
                    key={d.label}
                    className="relative flex flex-1 flex-col items-center justify-end"
                  >
                    <div
                      className="w-full rounded-t-sm bg-primary/20 transition-colors hover:bg-primary/40"
                      style={{ height: `${height}%` }}
                    />
                    <span className="mt-1 text-[10px] text-muted-foreground">
                      {d.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-sm bg-primary/20" />
                <span className="text-xs text-muted-foreground">Tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-sm bg-primary" />
                <span className="text-xs text-muted-foreground">Queries</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              AI Usage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiUsage.map((item) => (
                <div key={item.type}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>{item.type}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Top Chatbot Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topQueries.map((item, i) => (
                <div key={item.query}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-xs text-muted-foreground tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-sm">{item.query}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm tabular-nums">{item.count}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.trend === "up" ? (
                          <TrendUp className="mr-0.5 size-2.5" />
                        ) : item.trend === "down" ? (
                          <TrendDown className="mr-0.5 size-2.5" />
                        ) : null}
                        {item.trend}
                      </Badge>
                    </div>
                  </div>
                  {i < topQueries.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Engagement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  label: "Avg. Response Time",
                  value: "1.2s",
                  detail: "↓ 0.3s from last month",
                },
                {
                  label: "Satisfaction Rate",
                  value: "94.8%",
                  detail: "↑ 2.1% from last month",
                },
                {
                  label: "Resolution Rate",
                  value: "87.3%",
                  detail: "↑ 1.5% from last month",
                },
                {
                  label: "Handoff Rate",
                  value: "4.2%",
                  detail: "↓ 0.8% from last month",
                },
                {
                  label: "Avg. Session Length",
                  value: "3m 12s",
                  detail: "↑ 24s from last month",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-medium">{item.value}</span>
                      <p className="text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
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

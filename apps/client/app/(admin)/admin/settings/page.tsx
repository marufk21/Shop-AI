"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { Separator } from "@workspace/ui/components/separator"
import { Storefront, Bell, PaintBrush, Key, Globe } from "@phosphor-icons/react"

export default function SettingsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your store settings and preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-1">
          <CardContent className="p-2">
            {[
              { icon: Storefront, label: "Store", id: "store" },
              { icon: Globe, label: "General", id: "general" },
              { icon: Bell, label: "Notifications", id: "notifications" },
              { icon: PaintBrush, label: "Appearance", id: "appearance" },
              { icon: Key, label: "API Keys", id: "api" },
            ].map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
                size="sm"
              >
                <item.icon className="mr-2 size-4" />
                {item.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Store Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" defaultValue="ShopAI Store" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="store-url">Store URL</Label>
              <Input id="store-url" defaultValue="shopai.store" />
            </div>
            <div className="space-y-3">
              <Label>Currency</Label>
              <select
                defaultValue="usd"
                className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none"
              >
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
              </select>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="font-medium">Notifications</Label>
              {[
                {
                  label: "Order confirmations",
                  desc: "Get notified when new orders come in",
                },
                {
                  label: "AI generation complete",
                  desc: "Notify when AI content generation finishes",
                },
                {
                  label: "Low inventory alerts",
                  desc: "Get warned when products run low",
                },
                {
                  label: "Weekly analytics report",
                  desc: "Receive a weekly summary of store performance",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

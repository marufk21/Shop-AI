"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Separator } from "@workspace/ui/components/separator"
import {
  Package,
  Heart,
  Gear,
  Clock,
  MapPin,
  CreditCard,
  UserCircle,
} from "@phosphor-icons/react"

const orders = [
  {
    id: "ORD-2024",
    date: "May 20, 2026",
    total: 141,
    status: "Delivered",
    items: 3,
  },
  {
    id: "ORD-1987",
    date: "May 12, 2026",
    total: 89,
    status: "Shipped",
    items: 1,
  },
  {
    id: "ORD-1952",
    date: "Apr 28, 2026",
    total: 252,
    status: "Delivered",
    items: 5,
  },
]

const wishlistItems = [
  { id: 1, name: "Mechanical Keyboard", price: 149, category: "Tech" },
  { id: 2, name: "Wool Throw Blanket", price: 78, category: "Home" },
  { id: 3, name: "Linen Apron", price: 38, category: "Kitchen" },
]

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Delivered: "default",
  Shipped: "secondary",
  Processing: "outline",
}

export default function ProfilePage() {
  return (
    <div className="py-8">
        <Card className="mb-8">
          <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row">
            <Avatar className="size-20">
              <AvatarFallback className="text-2xl">
                <UserCircle className="size-10" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="font-heading text-xl font-semibold">Sarah Chen</h1>
              <p className="text-sm text-muted-foreground">
                sarah.chen@email.com
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Member since January 2025
              </p>
            </div>
            <Button variant="outline" size="sm" className="sm:ml-auto">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="orders">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="orders">
              <Package className="mr-1.5 size-3.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="mr-1.5 size-3.5" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Gear className="mr-1.5 size-3.5" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-2.5" />
                            {order.date}
                          </span>
                          <span>{order.items} items</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusVariant[order.status]}>
                        {order.status}
                      </Badge>
                      <span className="text-sm font-semibold">
                        ${order.total}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="mb-3 aspect-square rounded-xl bg-muted" />
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                    </p>
                    <h3 className="mt-0.5 text-sm font-medium">{item.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-semibold text-primary">
                        ${item.price}
                      </span>
                      <Button size="xs">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: UserCircle,
                    label: "Personal Information",
                    desc: "Update your name, email, and profile photo",
                  },
                  {
                    icon: MapPin,
                    label: "Addresses",
                    desc: "Manage shipping and billing addresses",
                  },
                  {
                    icon: CreditCard,
                    label: "Payment Methods",
                    desc: "Add or remove saved payment methods",
                  },
                  {
                    icon: Gear,
                    label: "Preferences",
                    desc: "Notification settings and communication preferences",
                  },
                ].map((item, i, arr) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                          <item.icon className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                    {i < arr.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}

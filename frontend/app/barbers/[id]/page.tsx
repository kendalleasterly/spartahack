import Image from "next/image"
import Link from "next/link"
import { Star, Phone, MessageSquare, Map, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

// This would come from your database
const barber = {
  id: 1,
  name: "James Wilson",
  rating: 4.8,
  price: 25,
  description:
    "I'm a professional barber with over 5 years of experience specializing in modern cuts and classic styles. Dedicated to providing top-quality service to every client.",
  image: "/placeholder.svg?height=400&width=400",
  recentWork: [
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ],
}

export default function BarberProfile() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/barbers" className="text-primary-600 hover:text-primary-700 transition-colors mb-4 inline-block">
            ← Back
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-primary-400 text-primary-400" />
                <span className="font-semibold">{barber.rating}</span>
              </div>
              <h1 className="text-2xl font-bold mb-1">Campus Barber</h1>
              <p className="text-muted-foreground mb-2">By {barber.name}</p>
              <p className="text-lg font-semibold text-primary-700">${barber.price}/Cut</p>
            </div>

            <div className="shrink-0">
              <Image
                src={barber.image || "/placeholder.svg"}
                alt={barber.name}
                width={100}
                height={100}
                className="rounded-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: Phone, label: "Call" },
            { icon: MessageSquare, label: "Message" },
            { icon: Map, label: "Direction" },
            { icon: Share2, label: "Share" },
          ].map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-primary-100 border-primary-300"
            >
              <action.icon className="w-5 h-5 text-primary-600" />
              <span className="text-sm text-primary-700">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" className="mb-6">
          <TabsList className="grid grid-cols-3 w-full bg-primary-100">
            <TabsTrigger
              value="about"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="mt-4">
            <Card className="p-4">
              <p className="text-muted-foreground">{barber.description}</p>
            </Card>
          </TabsContent>
          <TabsContent value="services">
            <Card className="p-4">
              <p>Services content here...</p>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card className="p-4">
              <p>Reviews content here...</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Works */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {barber.recentWork.map((work, index) => (
              <Image
                key={index}
                src={work || "/placeholder.svg"}
                alt={`Recent work ${index + 1}`}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square"
              />
            ))}
          </div>
        </div>

        {/* Book Button */}
        <Button className="w-full py-6 text-lg bg-primary hover:bg-primary-600 text-primary-foreground">
          Book Appointment
        </Button>
      </div>
    </div>
  )
}
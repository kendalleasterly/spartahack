"use client"
import Link from "next/link"
import { Star, MessageSquare, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { CldImage } from "next-cloudinary"

// This would come from your database
const barber = {
	id: 1,
	name: "James Wilson",
	styles: ["Modern Cut", "Classic Cut", "Fade", "Taper"],
	rating: 4.8,
	price: 25,
	neighborhood: "Brody",
	description:
		"I'm a professional barber with over 5 years of experience specializing in modern cuts and classic styles. Dedicated to providing top-quality service to every client.",
	image: "barbers/czsglmmrbgriuyjfq2hn",
	recentWork: [
		"Haircuts/afgklpmolylk69unnhg4",
		"Haircuts/yixerlv1tdh7ysbje2yo",
		"Haircuts/xikrcwazsztlx8tanyzz",
		"Haircuts/zuuzd3citxe50awp6cxc",
	],
}

function getBarberStyles(styles: string[]) {
	return styles.join(", ")
}

//p-4 md:p-6

export default function BarberProfile() {
	return (
		<div className="min-h-screen bg-background ">
			{/* Header */}
			<div className="bg-emerald-900">
				<div className="mb-6 p-4 md:p-6 mx-auto max-w-2xl">
					<Link
						href="/barbers"
						className="text-gray-200 hover:text-gray-200 transition-colors mb-4 inline-block"
					>
						← Back
					</Link>

					<div className="flex items-start justify-between gap-6">
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Star className="w-5 h-5 fill-gray-100 text-gray-100" />
								<span className="font-semibold text-gray-100">{barber.rating}</span>
							</div>
							<h1 className="text-2xl font-bold mb-1 text-gray-100">{barber.name}</h1>
							<p className="text-gray-300 mb-2">
								{getBarberStyles(barber.styles)}{" "}
							</p>
							<p className="text-lg font-semibold text-gray-100">
								${barber.price}/Cut
							</p>
						</div>

						<div className="shrink-0">
							<CldImage
								src={barber.image}
								alt="Barber"
								width={100}
								height={100}
								className="rounded-full object-cover aspect-square"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Action Buttons */}

			<div className="p-4 md:p-6 mx-auto max-w-2xl">
				<div className="grid grid-cols-2 gap-4 mb-6">
					{[
						{ icon: Map, label: barber.neighborhood },
						{ icon: MessageSquare, label: "Message" },
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
					<TabsList className="grid grid-cols-2 w-full bg-emerald-100">
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
					</TabsList>
					<TabsContent value="about" className="mt-4">
						<Card className="p-4">
							<p className="text-muted-foreground">{barber.description}</p>
						</Card>
					</TabsContent>
					<TabsContent value="services">
						<Card className="p-4">
							<p>
								For each service, We would list different prices for different
								services
							</p>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Recent Works */}
				<div className="mb-6">
					<h2 className="text-xl font-semibold mb-4">Recent Works</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{barber.recentWork.map((work, index) => (
							<CldImage
								key={index}
								src={work}
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

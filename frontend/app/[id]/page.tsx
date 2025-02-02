"use client"
import Link from "next/link"
import { Star, MessageSquare, Map, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { CldImage } from "next-cloudinary"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import { Barber } from "@/lib/schemas"
import {getBarberStyles} from "@/app/utils"

// This would come from your database
const barberPlaceholder = {
	name: "...",
	hairstyles: ["...", "...", "..."],
	rating: 4.8,
	cost: 25,
	neighborhood: "...",
	biography:
		"...",
	image: "...",
	example_images: [
	],
	profile_image: "",
	"will-travel": false,
	gender: "...",
	dorm: "...",
	_id: "",
}



//p-4 md:p-6

export default function BarberProfile() {

	const { id } = useParams();

	const [barberData, setBarberData] = useState<Barber>(barberPlaceholder);

	useEffect(() => {
		async function fetchBarber() {
			console.log(process.env.NEXT_PUBLIC_BACKEND_URL, "is backend url");
			try {
				const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get_barber`, {
					params: { id }
				});
				console.log(response.data);
				setBarberData(response.data[0]);
			} catch (error) {
				console.error('Error fetching barber:', error);
			}
		}

		fetchBarber();
	}, [id]);

	return (
		<div className="min-h-screen bg-background ">
			{/* Header */}
			<div className="bg-emerald-900">
				<div className="mb-6 p-4 md:p-6 mx-auto max-w-2xl">
					<Link
						href="/"
						className="text-gray-200 hover:text-gray-200 transition-colors mb-4 inline-block"
					>
						← Back
					</Link>

					<div className="flex items-start justify-between gap-6">
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Star className="w-5 h-5 fill-gray-100 text-gray-100" />
								<span className="font-semibold text-gray-100">{barberData.rating}</span>
							</div>
							<h1 className="text-2xl font-bold mb-1 text-gray-100">{barberData.name}</h1>
							<p className="text-gray-300 mb-2">
								{getBarberStyles(barberData.hairstyles)}{" "}
							</p>
							<p className="text-lg font-semibold text-gray-100">
								${barberData.cost}/Cut
							</p>
						</div>

						<div className="shrink-0">
							{barberData.profile_image ? (
								<CldImage
									src={barberData.profile_image}
									alt="Barber"
									width={100}
									height={100}
									className="rounded-full object-cover aspect-square"
								/>
							) : (
								<div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center">
									<User className="w-12 h-12 text-gray-400" />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Action Buttons */}

			<div className="p-4 md:p-6 mx-auto max-w-2xl">
				<div className="grid grid-cols-2 gap-4 mb-6">
					{[
						{ icon: Map, label: barberData.neighborhood },
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
					<TabsList className="grid grid-cols-2 w-full bg-emerald-50">
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
							<p className="text-muted-foreground">{barberData.biography}</p>
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
						{barberData.example_images.map((work, index) => (
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
				<Link href={`/${id}/book`}>
					<Button className="w-full py-6 text-lg bg-primary hover:bg-primary-600 text-primary-foreground">
						Book Appointment
					</Button>
				</Link>
			</div>
		</div>
	)
}




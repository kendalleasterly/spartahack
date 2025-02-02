"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import {
	CalendarIcon,
	Clock,
	CreditCard,
	AppleIcon,
	MapPin,
	Home,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Barber from "@/lib/schemas"
import {getBarberStylesWithOr} from "@/app/barbers/utils"

// This would come from your database
const barber: Barber = {
	_id: "",
	name: "James Wilson",
	profile_image: "/placeholder.svg",
	"will-travel": true, // New field indicating if the barber will travel
	dorm: "McDonnel", // Barber's location if they don't travel
	hairstyles: [
		"Regular Haircut",
		"Haircut & Beard Trim",
		"Beard Trim",
		"Hair Styling",
	],
	rating: 4.5,
	gender: "Male",
	neighborhood: "Rivertrail",
	cost: 25,
	biography:
		"I'm a barber with a passion for making people look and feel their best.",
	example_images: [],
}

const availableTimes = [
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"14:00",
	"14:30",
	"15:00",
]

export default function BookingPage() {
	const [date, setDate] = useState<Date>()
	const [selectedTime, setSelectedTime] = useState("")
	const [paymentMethod, setPaymentMethod] = useState<"card" | "apple">("card")
	const [location, setLocation] = useState(
		barber["will-travel"] ? "" : "barber"
	)

	return (
		<div className="min-h-screen ">
			<div className="bg-emerald-800">
				<div className="p-4 md:p-6 mx-auto max-w-2xl">
					<Link
						href={`/barbers/${barber._id}`}
						className="text-gray-200 hover:text-gray-200 transition-colors mb-6 inline-block"
					>
						← Back
					</Link>

					{/* Barber Info */}
					<CardHeader className="flex-row items-center gap-4">
						<Image
							src={barber.profile_image || "/placeholder.svg"}
							alt={barber.name}
							width={60}
							height={60}
							className="rounded-full"
						/>
						<div>
							<CardTitle className="text-gray-200">{barber.name}</CardTitle>
							<CardDescription className="text-gray-200">{getBarberStylesWithOr(barber.hairstyles)}</CardDescription>
						</div>
					</CardHeader>
				</div>
            </div>

				<div className="p-4 md:p-6 mx-auto max-w-2xl grid gap-6 ">
					{/* Location Selection */}
					<Card>
						<CardHeader>
							<CardTitle>Location</CardTitle>
							<CardDescription>
								Choose where you&apos;d like the service to take place
							</CardDescription>
						</CardHeader>
						<CardContent>
							{barber["will-travel"] ? (
								<RadioGroup value={location} onValueChange={setLocation}>
									<div className="flex items-center space-x-2 mb-2">
										<RadioGroupItem value="barber" id="barber-location" />
										<Label
											htmlFor="barber-location"
											className="flex items-center"
										>
											<MapPin className="mr-2 h-4 w-4" />
											{barber.dorm}
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="client" id="client-location" />
										<Label
											htmlFor="client-location"
											className="flex items-center"
										>
											<Home className="mr-2 h-4 w-4" />
											Your Location
										</Label>
									</div>
								</RadioGroup>
							) : (
								<div className="text-muted-foreground">
									This barber doesn&apos;t offer mobile services. You&apos;ll
									need to visit them at: {barber.dorm}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Service Selection */}
					{/* <Card>
                        <CardHeader>
                        <CardTitle>Select Service</CardTitle>
                        <CardDescription>Choose the service you want to book</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                            {barber.services.map((service) => (
                                <SelectItem key={service.id} value={service.id.toString()}>
                                <div className="flex justify-between items-center gap-4">
                                    <span>{service.name}</span>
                                    <span className="text-muted-foreground">
                                    ${service.price} • {service.duration}
                                    </span>
                                </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </CardContent>
                    </Card> */}

					{/* Date and Time Selection */}
					<Card>
						<CardHeader>
							<CardTitle>Select Date & Time</CardTitle>
							<CardDescription>
								Choose when you&apos;d like your appointment
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							<div>
								<Label>Date</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="w-full justify-start text-left font-normal mt-1.5"
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{date ? format(date, "PPP") : <span>Pick a date</span>}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={date}
											onSelect={setDate}
											initialFocus
											disabled={(date) => date < new Date()}
										/>
									</PopoverContent>
								</Popover>
							</div>

							<div>
								<Label>Time</Label>
								<Select value={selectedTime} onValueChange={setSelectedTime}>
									<SelectTrigger className="mt-1.5">
										<SelectValue placeholder="Select a time">
											{selectedTime ? (
												<div className="flex items-center">
													<Clock className="mr-2 h-4 w-4" />
													{selectedTime}
												</div>
											) : (
												"Select a time"
											)}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{availableTimes.map((time) => (
											<SelectItem key={time} value={time}>
												<div className="flex items-center">
													<Clock className="mr-2 h-4 w-4" />
													{time}
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* Additional Comments */}
					<Card>
						<CardHeader>
							<CardTitle>Additional Comments</CardTitle>
							<CardDescription>
								Any special requests or notes for your barber?
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Textarea
								placeholder="E.g., I prefer scissors over clippers, specific style references, etc."
								className="min-h-[100px]"
							/>
						</CardContent>
					</Card>

					{/* Payment */}
					<Card>
						<CardHeader>
							<CardTitle>Payment Method</CardTitle>
							<CardDescription>
								Choose how you&apos;d like to pay for your appointment
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-6">
							<div className="flex gap-4">
								<Button
									variant={paymentMethod === "card" ? "default" : "outline"}
									className="flex-1"
									onClick={() => setPaymentMethod("card")}
								>
									<CreditCard className="mr-2 h-4 w-4" />
									Credit Card
								</Button>
								<Button
									variant={paymentMethod === "apple" ? "default" : "outline"}
									className="flex-1"
									onClick={() => setPaymentMethod("apple")}
								>
									<AppleIcon className="mr-2 h-4 w-4" />
									Apple Pay
								</Button>
							</div>

							{paymentMethod === "card" && (
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="name">Name on Card</Label>
										<Input id="name" placeholder="John Doe" />
									</div>
									<div className="grid gap-2">
										<Label htmlFor="number">Card Number</Label>
										<Input id="number" placeholder="1234 5678 9012 3456" />
									</div>
									<div className="grid grid-cols-3 gap-4">
										<div className="grid gap-2">
											<Label htmlFor="month">Expiry Month</Label>
											<Select>
												<SelectTrigger id="month">
													<SelectValue placeholder="MM" />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 12 }, (_, i) => {
														const month = (i + 1).toString().padStart(2, "0")
														return (
															<SelectItem key={month} value={month}>
																{month}
															</SelectItem>
														)
													})}
												</SelectContent>
											</Select>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="year">Expiry Year</Label>
											<Select>
												<SelectTrigger id="year">
													<SelectValue placeholder="YY" />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 10 }, (_, i) => {
														const year = (new Date().getFullYear() + i)
															.toString()
															.slice(-2)
														return (
															<SelectItem key={year} value={year}>
																{year}
															</SelectItem>
														)
													})}
												</SelectContent>
											</Select>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="cvc">CVC</Label>
											<Input id="cvc" placeholder="123" />
										</div>
									</div>
								</div>
							)}
						</CardContent>
						<Separator className="my-4" />
						<CardFooter className="flex-col gap-4">
							<div className="w-full flex justify-between text-sm">
								<span className="text-muted-foreground">Location</span>
								<span className="font-medium">
									{location === "barber"
										? "Barber's Location"
										: location === "client"
										? "Your Location"
										: barber["will-travel"]
										? "Not selected"
										: barber.dorm}
								</span>
							</div>
							<div className="w-full flex justify-between text-sm">
								<span className="text-muted-foreground">Date & Time</span>
								<span className="font-medium">
									{date && selectedTime
										? `${format(date, "PP")} at ${selectedTime}`
										: "Not selected"}
								</span>
							</div>
							<div className="w-full flex justify-between text-base font-semibold">
								<span>Total</span>
								<span>${barber.cost}</span>
							</div>
							<Button className="w-full" size="lg">
								Confirm Booking
							</Button>
						</CardFooter>
					</Card>
				</div>
		</div>
	)
}

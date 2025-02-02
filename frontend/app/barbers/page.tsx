"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Star, MapPin, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CldImage } from "next-cloudinary"

// This would come from your database
const popularBarbers = [
	{
		id: 1,
		name: "Mike",
		image: "barbers/pcdbnkg0v4tjxpn81imq",
		featured: true,
	},
	{ id: 2, name: "Sarah", image: "barbers/czsglmmrbgriuyjfq2hn" },
	{ id: 3, name: "John", image: "barbers/v3ofdobuknt9yvuzu8p0" },
	{ id: 4, name: "Lisa", image: "barbers/cnznrvjpnia5htamwfwi" },
	{ id: 5, name: "David", image: "barbers/w8wljpnc1pydejtwywva" },
]

const barbers = [
	{
		id: 1,
		name: "Mike Wilson",
		service: "Master Barber",
		rating: 4.8,
		price: 35,
		neighborhood: "North Campus",
		image: "barbers/pcdbnkg0v4tjxpn81imq",
		styles: ["Modern Cut", "Classic Cut", "Fade", "Taper"],
		gender: "male",
	},
	{
		id: 2,
		name: "Sarah Chen",
		service: "Hair Stylist",
		rating: 4.2,
		price: 30,
		neighborhood: "South Campus",
		image: "barbers/czsglmmrbgriuyjfq2hn",
		styles: ["Pixie Cut", "Bob Cut", "Layered Cut", "Hair Coloring"],
		gender: "female",
	},
	// Add more barbers...
]

export default function BarbersPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [filters, setFilters] = useState({
		minRating: 0,
		maxPrice: 100,
		gender: "all",
	})

	const filteredBarbers = barbers.filter((barber) => {
		return (
			barber.rating >= filters.minRating &&
			barber.price <= filters.maxPrice &&
			(filters.gender === "all" || barber.gender === filters.gender) &&
			(barber.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				barber.service.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	})

	return (
		<div className="min-h-screen bg-background">
			<div className="bg-emerald-900">
				<div className="max-w-2xl mx-auto p-4">
					{/* Header */}
					<div className="flex items-center gap-2 mb-6">
						<Link
							href="/"
							className="text-white hover:text-primary-700 transition-colors"
						>
							← Cancel
						</Link>
					</div>

					{/* Search Bar */}
					<div className="relative mb-6">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
						<Input
							type="search"
							placeholder="Search barbers..."
							className="pl-10 pr-8 bg-emerald-50"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<Button
							variant="ghost" 
							size="icon"
							className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 bg-emerald-50"
						>
							<Upload className="w-3 h-3" />
						</Button>
					</div>
				</div>
			</div>

			<div className="max-w-2xl mx-auto p-4">
				{/* Popular Barbers */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold mb-4">Popular Barbers</h2>
					<ScrollArea>
						<div className="flex gap-4 pb-4">
							{popularBarbers.map((barber) => (
								<Link
									href={`/barbers/${barber.id}`}
									key={barber.id}
									className="flex flex-col items-center gap-2 min-w-[80px] hover:opacity-80 transition-opacity"
								>
									<div className="relative">
										<CldImage
											src={barber.image}
											alt={barber.name}
											width={80}
											height={80}
											className="rounded-full object-cover aspect-square p-1 border-2 border-primary-900 hover:border-primary-900 transition-colors"
										/>
									</div>
									<span className="text-sm">{barber.name}</span>
								</Link>
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>

				{/* Filters */}
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">
						Results Found ({filteredBarbers.length})
					</h2>
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline">Filters</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Filter Barbers</SheetTitle>
							</SheetHeader>
							<div className="grid gap-6 py-4">
								<div className="grid gap-2">
									<label className="text-sm font-medium">Minimum Rating</label>
									<Slider
										min={0}
										max={5}
										step={0.5}
										value={[filters.minRating]}
										onValueChange={([value]) =>
											setFilters({ ...filters, minRating: value })
										}
									/>
									<span className="text-sm text-muted-foreground">
										{filters.minRating} stars or higher
									</span>
								</div>
								<div className="grid gap-2">
									<label className="text-sm font-medium">Maximum Price</label>
									<Slider
										min={0}
										max={100}
										step={5}
										value={[filters.maxPrice]}
										onValueChange={([value]) =>
											setFilters({ ...filters, maxPrice: value })
										}
									/>
									<span className="text-sm text-muted-foreground">
										Up to ${filters.maxPrice}
									</span>
								</div>
								<div className="grid gap-2">
									<label className="text-sm font-medium">Barber Gender</label>
									<Select
										value={filters.gender}
										onValueChange={(value) =>
											setFilters({ ...filters, gender: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select gender preference" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All</SelectItem>
											<SelectItem value="male">Male</SelectItem>
											<SelectItem value="female">Female</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>

				{/* Barber List */}
				<div className="grid gap-4">
					{filteredBarbers.map((barber) => (
						<Link
							key={barber.id}
							href={`/barbers/${barber.id}`}
							className="flex gap-4 p-4 bg-card rounded-lg border hover:border-primary-300 transition-colors shadow-sm"
						>
							<CldImage
								src={barber.image}
								alt={barber.name}
								width={80}
								height={80}
								className="rounded-lg object-cover aspect-square"
							/>
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<Star className="w-4 h-4 fill-primary-400 text-primary-400" />
									<span className="font-semibold">{barber.rating}</span>
									<div className="flex items-center gap-1 ml-auto text-muted-foreground">
										<MapPin className="w-4 h-4" />
										<span className="text-sm">{barber.neighborhood}</span>
									</div>
								</div>
								<h3 className="font-semibold mb-1">{barber.service}</h3>
								<p className="text-sm text-muted-foreground mb-2">
									By {barber.name}
								</p>
								<div className="flex items-center justify-between">
									<span className="font-semibold">
										${barber.price}
										<span className="text-sm text-muted-foreground">/Cut</span>
									</span>
									<Button size="sm" className="bg-emerald-50 text-black-600">Book</Button>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}

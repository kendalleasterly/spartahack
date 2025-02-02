"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Search, Star, MapPin } from "lucide-react"
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
import {Barber} from "@/lib/schemas"
import {getBarberStyles, formatBarberName} from "@/app/utils"
import { UploadModal } from "@/components/upload-modal"

export default function BarbersPage() {
	const [searchQuery, setSearchQuery] = useState("")
	const [filters, setFilters] = useState({
		minRating: 0,
		maxPrice: 100,
		gender: "all",
	})
	const [barbers, setBarbers] = useState<Barber[]>([])

	useEffect(() => {
		async function fetchBarbers() {
			try {
				const params: Record<string, string | number> = {}
				if (searchQuery.trim()) {
					params.name = searchQuery.trim()
				}
				if (filters.minRating > 0) {
					params.rating = filters.minRating
				}
				if (filters.maxPrice < 100) {
					params.cost = filters.maxPrice
				}
				if (filters.gender !== "all") {
					params.gender = filters.gender
				}
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/get_barber`,
					{ params }
				)
				setBarbers(response.data)
			} catch (error) {
				console.error("Error fetching barbers:", error)
			}
		}
		fetchBarbers()
	}, [searchQuery, filters])
	
	const popularBarbers = barbers.filter((barber) => barber.rating >= 4.5)

	return (
		<div className="min-h-screen bg-background">
			<div className="bg-emerald-900">
				<div className="max-w-2xl mx-auto p-4">
					{/* Header */}
					{/* <div className="flex items-center gap-2 mb-6">
						<Link
							href="/"
							className="text-white hover:text-primary-700 transition-colors"
						>
							← Cancel
						</Link>
					</div> */}

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
							<UploadModal />
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
									href={`/${barber._id}`}
									key={barber._id}
									className="flex flex-col items-center gap-2 min-w-[80px] hover:opacity-80 transition-opacity"
								>
									<div className="relative">
										<CldImage
											src={barber.profile_image}
											alt={barber.name}
											width={80}
											height={80}
											className="rounded-full object-cover aspect-square p-1 border-2 border-primary-900 hover:border-primary-900 transition-colors"
										/>
									</div>
									<span className="text-sm">{formatBarberName(barber.name)}</span>
								</Link>
							))}
						</div>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</div>

				{/* Filters */}
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">
						Results Found ({barbers.length})
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
					{barbers.map((barber) => (
						<Link
							key={barber._id}
							href={`/${barber._id}`}
							className="flex gap-4 p-4 bg-card rounded-lg border hover:border-primary-300 transition-colors shadow-sm"
						>
							<CldImage
								src={barber.profile_image}
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
								<h3 className="font-semibold mb-1">{barber.name}</h3>
								<p className="text-sm text-muted-foreground mb-2">
									{getBarberStyles(barber.hairstyles)}
								</p>
								<div className="flex items-center justify-between">
									<span className="font-semibold">
										${barber.cost}
										<span className="text-sm text-muted-foreground">/Cut</span>
									</span>
									<Link href={`/${barber._id}/book`}>
										<Button size="sm" className="bg-emerald-50 text-black-600">Book</Button>
									</Link>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}

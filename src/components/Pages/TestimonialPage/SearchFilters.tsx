// src/components/Pages/Testimonials/SearchFilters.jsx
"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const SearchFilters = ({ 
    searchQuery, 
    setSearchQuery, 
    categoryFilter, 
    setCategoryFilter, 
    ratingFilter, 
    setRatingFilter, 
    categories, 
    ratings, 
    t 
}) => {
    return (
        <div className="bg-muted/50 rounded-xl p-4 md:p-6 mb-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="pl-10"
            />
            </div>

            {/* Category filter */}
            <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {categories.map((category) => (
                <option key={category} value={category}>
                    {category === "All" ? t.allCategories : category}
                </option>
                ))}
            </select>
            </div>

            {/* Rating filter */}
            <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {ratings.map((rating) => (
                <option key={rating} value={rating}>
                    {rating === "All" ? t.allRatings : `${rating} ★`}
                </option>
                ))}
            </select>
            </div>
        </div>

        {/* Reset button */}
        <div className="flex justify-end">
            <Button
            variant="outline"
            onClick={() => {
                setSearchQuery("");
                setCategoryFilter("All");
                setRatingFilter("All");
            }}
            size="sm"
            >
            {t.resetFilters}
            </Button>
        </div>
        </div>
    )
}

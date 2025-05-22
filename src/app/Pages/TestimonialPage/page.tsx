"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/components/Pages/TestimonialPage/translations";
import { staticTestimonialsData } from "@/components/Pages/TestimonialPage/testimonials-data";
import { TestimonialsHero } from "@/components/Pages/TestimonialPage/Hero";
import { SearchFilters } from "@/components/Pages/TestimonialPage/SearchFilters";
import { TestimonialsList } from "@/components/Pages/TestimonialPage/TestimonialsList";
import { CTASection } from "@/components/Pages/TestimonialPage/CTASection";


export default function TestimonialsPage() {
  const { language, direction } = useLanguage();
  const t = translations[language] || translations.en;

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  // Get unique categories from testimonials
  const categories = testimonials.length > 0 
    ? ["All", ...new Set(testimonials.map(t => t.category))]
    : ["All"];

  // Get unique ratings from testimonials
  const ratings = testimonials.length > 0
    ? ["All", ...new Set(testimonials.map(t => t.rating.toString()))]
    : ["All"];

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we'll use our static data based on language
        setTimeout(() => {
          setTestimonials(staticTestimonialsData[language] || staticTestimonialsData.en);
          setLoading(false);
        }, 1000); // Simulate network delay
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [language]); // Re-fetch when language changes

  // Filter testimonials based on search query and filters
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "All" || testimonial.category === categoryFilter;
    const matchesRating = ratingFilter === "All" || testimonial.rating.toString() === ratingFilter;

    return matchesSearch && matchesCategory && matchesRating;
  });

  // Reset filters function
  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setRatingFilter("All");
  };

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {/* Hero section */}
      <TestimonialsHero t={t} direction={direction} />

      {/* Search and filters */}
      <section className="container px-4 md:px-6 mb-8">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          categories={categories}
          ratings={ratings}
          t={t}
        />
      </section>

      {/* Testimonials grid */}
      <section className="container px-4 md:px-6 mb-20">
        <TestimonialsList
          loading={loading}
          error={error}
          filteredTestimonials={filteredTestimonials}
          t={t}
          direction={direction}
          resetFilters={resetFilters}
        />
      </section>

      {/* CTA section */}
      <CTASection t={t} />


    </div>
  );
}
import Navbar        from "@/components/landing/Navbar"
import Hero          from "@/components/landing/Hero"
import Stats         from "@/components/landing/Stats"
import Features      from "@/components/landing/Features"
import ProductPreview from "@/components/landing/ProductPreview"
import Modules       from "@/components/landing/Modules"
import DemoCTA       from "@/components/landing/DemoCTA"
import Pricing       from "@/components/landing/Pricing"
import Testimonials  from "@/components/landing/Testimonials"
import FAQ           from "@/components/landing/FAQ"
import LandingFooter from "@/components/landing/LandingFooter"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <ProductPreview />
        <Modules />
        <DemoCTA />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <LandingFooter />
    </div>
  )
}

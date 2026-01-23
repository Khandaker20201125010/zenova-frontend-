// app/page.tsx

import BlogSection from "./blog-section";
import CTASection from "./cta-section";
import FAQSection from "./faq-section";
import FeaturesSection from "./features-section";
import HeroSection from "./hero-section";
import ProductsSection from "./products-section";
import StatsSection from "./stats-section";
import TestimonialsSection from "./testimonials-section";


export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <StatsSection />
      <TestimonialsSection />
      <BlogSection />
      <FAQSection/>
      <CTASection />
    </>
  )
}
// app/about/page.tsx
import { Metadata } from 'next'

import MissionVision from '../../components/about/mission-vision'
import StatsSection from '../../components/home/stats-section'
import ValuesSection from '../../components/about/values-section'
import TimelineSection from '../../components/about/timeline-section'
import TeamSection from '../../components/about/team-section'
import CTASection from '../../components/about/cta-section'
import HeroSection from '../../components/about/hero-section'


export const metadata: Metadata = {
  title: 'About Us | SaaS Platform',
  description: 'Learn about our mission, team, and values. Discover how we\'re revolutionizing business software.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MissionVision />
      <StatsSection />
      <ValuesSection />
      <TimelineSection />
      <TeamSection />
      <CTASection />
    </div>
  )
}
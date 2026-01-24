/* eslint-disable react/no-unescaped-entities */
// app/contact/page.tsx
import { Metadata } from 'next'
import FAQSection from '../../components/home/faq-section'
import ContactForm from '../../components/forms/contact-form'
import ContactInfo from '../../components/contact/contact-info'
import SupportChannels from '../../components/contact/support-channels'
import MapSection from '../../components/contact/map-section'


export const metadata: Metadata = {
  title: 'Contact Us | SaaS Platform',
  description: 'Get in touch with our team. We\'re here to help with any questions or support needs.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in <span className="text-gradient-primary">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Send us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-8">
            <ContactInfo />
            <SupportChannels />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find quick answers to common questions
            </p>
          </div>
          <FAQSection />
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <MapSection />
        </div>
      </div>
    </div>
  )
}
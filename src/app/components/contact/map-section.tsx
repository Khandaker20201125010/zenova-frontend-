// components/contact/map-section.tsx
'use client'

import { MapPin, Navigation, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

export default function MapSection() {
  // Coordinates for San Francisco (example)
  const coordinates = {
    lat: 37.7749,
    lng: -122.4194,
  }

  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
  }

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Visit Our Office</h3>
        <p className="text-muted-foreground">
          Come visit us at our headquarters in San Francisco
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                {/* Google Maps Embed */}
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d201143.51869334523!2d-122.1811843328125!3d37.76328620000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1706141234567!5m2!1sen!2sus`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Office Location"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Address</h4>
                <p className="text-sm text-muted-foreground">
                  123 Tech Street<br />
                  San Francisco, CA 94107<br />
                  United States
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Parking Information</h4>
                <p className="text-sm text-muted-foreground">
                  Street parking available. Nearest parking garage: Tech Center Garage (2 blocks away)
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Public Transportation</h4>
                <p className="text-sm text-muted-foreground">
                  • BART: Montgomery Station (10 min walk)<br />
                  • Muni: F-Market & Wharves (5 min walk)<br />
                  • Bus: Lines 8, 30, 45
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button asChild className="gap-2">
              <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4" />
                Get Directions
              </a>
            </Button>
            
            <Button asChild variant="outline" className="gap-2">
              <a href={getGoogleMapsUrl()} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-4 w-4" />
                View on Google Maps
              </a>
            </Button>

            <Button asChild variant="outline" className="gap-2">
              <a href="tel:+15551234567">
                <Phone className="h-4 w-4" />
                Call Office: (555) 123-4567
              </a>
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Before You Visit</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Please schedule an appointment in advance</li>
                <li>• Bring a valid ID for security check-in</li>
                <li>• Free Wi-Fi available for visitors</li>
                <li>• Wheelchair accessible entrance</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
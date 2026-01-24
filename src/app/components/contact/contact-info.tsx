// components/contact/contact-info.tsx
'use client'

import { Phone, Mail, MapPin, Clock, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export default function ContactInfo() {
  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Mon-Fri, 9am-6pm EST',
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email',
      details: ['support@saasplatform.com', 'sales@saasplatform.com'],
      description: 'We respond within 24 hours',
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Office',
      details: ['123 Tech Street', 'San Francisco, CA 94107'],
      description: 'Visit us by appointment',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM'],
      description: 'Closed on Sundays',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contactInfo.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="text-primary">{item.icon}</div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              {item.details.map((detail, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {detail}
                </p>
              ))}
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
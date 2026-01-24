// components/contact/support-channels.tsx
'use client'

import { MessageCircle, Video, FileText, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function SupportChannels() {
  const supportChannels = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      href: '/support/chat',
      available: true,
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: 'Video Call',
      description: 'Schedule a screen sharing session',
      action: 'Schedule Call',
      href: '/support/schedule',
      available: true,
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Documentation',
      description: 'Browse our comprehensive guides',
      action: 'View Docs',
      href: '/docs',
      available: true,
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Community Forum',
      description: 'Connect with other users',
      action: 'Join Community',
      href: '/community',
      available: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Channels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {supportChannels.map((channel, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <div className="text-primary">{channel.icon}</div>
              </div>
              <div>
                <h3 className="font-semibold">{channel.title}</h3>
                <p className="text-sm text-muted-foreground">{channel.description}</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={channel.href}>{channel.action}</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
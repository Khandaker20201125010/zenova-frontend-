// components/layout/site-footer.tsx
import Link from "next/link"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Separator } from "../../ui/separator"
import { SOCIAL_LINKS } from "@/src/app/lib/utils/constants"


export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    Product: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "API", href: "/api" },
      { label: "Documentation", href: "/docs" },
      { label: "Status", href: "/status" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Partners", href: "/partners" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
    Resources: [
      { label: "Community", href: "/community" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Webinars", href: "/webinars" },
      { label: "Open Source", href: "/open-source" },
      { label: "FAQs", href: "/faq" },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: SOCIAL_LINKS.twitter, label: "Twitter" },
    { icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
    { icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
    { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: "LinkedIn" },
    { icon: Github, href: SOCIAL_LINKS.github, label: "GitHub" },
  ]

  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter Section */}
      <div className="container py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for the latest updates, features, and insights.
            </p>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter your email" 
              type="email"
              className="flex-1"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold">SaaS Platform</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Professional SaaS platform with e-commerce, blog, dashboard, and analytics features. 
              Streamline your business operations.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mb-6">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-10 w-10"
                >
                  <Link href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </Button>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">contact@saasplatform.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">123 Business St, San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} SaaS Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
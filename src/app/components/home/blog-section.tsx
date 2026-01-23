// components/home/blog-section.tsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, User, ArrowRight, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { formatDate } from "../../lib/utils/helpers"


const blogPosts = [
  {
    id: 1,
    title: "10 Ways to Boost Your Business Productivity",
    slug: "boost-business-productivity",
    excerpt: "Discover proven strategies to increase efficiency and productivity in your organization.",
    author: "John Smith",
    date: "2024-03-15",
    readTime: "5 min",
    category: "Productivity",
  },
  {
    id: 2,
    title: "The Future of E-Commerce in 2024",
    slug: "future-of-ecommerce-2024",
    excerpt: "Explore the latest trends and technologies shaping the e-commerce landscape.",
    author: "Sarah Johnson",
    date: "2024-03-10",
    readTime: "8 min",
    category: "E-Commerce",
  },
  {
    id: 3,
    title: "Getting Started with Data Analytics",
    slug: "getting-started-data-analytics",
    excerpt: "A beginner's guide to implementing data analytics in your business.",
    author: "Michael Chen",
    date: "2024-03-05",
    readTime: "6 min",
    category: "Analytics",
  },
]

export default function BlogSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">From Our Blog</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest Insights & Updates
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Stay updated with the latest trends, tips, and industry news
          </p>
          <Button variant="outline" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readTime} read</span>
                  </div>
                  <CardTitle className="text-xl">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.date, "MMM d")}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg">
            <Link href="/blog">
              Read More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
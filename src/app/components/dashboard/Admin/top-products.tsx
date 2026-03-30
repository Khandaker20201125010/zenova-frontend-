"use client"

import { Card, CardContent } from "@/src/app/components/ui/card"
import { formatCurrency } from "@/src/app/lib/utils/helpers"
import { Package, TrendingUp } from "lucide-react"

interface TopProductsProps {
  data?: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
}

export function TopProducts({ data = [] }: TopProductsProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No product data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.slice(0, 6).map((product, index) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium line-clamp-1">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.sales} sales
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{formatCurrency(product.revenue)}</p>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>Top #{index + 1}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
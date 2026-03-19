"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/app/components/ui/button"
import { Input } from "@/src/app/components/ui/input"
import { Plus, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/app/components/ui/select"
import { useToast } from "@/src/app/hooks/use-toast"
import { Product } from "@/src/app/lib/types"
import { ProductFilters, productsApi } from "@/src/app/lib/api/products"
import { ProductsTable } from "@/src/app/components/dashboard/tables/products-table"


export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 10,
        search: "",
        category: "",
        inStock: undefined,
        isFeatured: undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
    })
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })
    const { toast } = useToast()

    useEffect(() => {
        fetchProducts()
    }, [filters])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await productsApi.getProducts(filters)
            // Fix: Access data property correctly
            setProducts(response.products)
            setPagination({
                page: response.page,
                limit: response.limit,
                total: response.total,
                totalPages: response.totalPages,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load products",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-8"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                />
                            </div>
                        </div>
                        <Select
                            value={filters.inStock?.toString() || "all"}
                            onValueChange={(value) =>
                                setFilters({
                                    ...filters,
                                    inStock: value === "all" ? undefined : value === "true",
                                    page: 1
                                })
                            }
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Stock Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">In Stock</SelectItem>
                                <SelectItem value="false">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.isFeatured?.toString() || "all"}
                            onValueChange={(value) =>
                                setFilters({
                                    ...filters,
                                    isFeatured: value === "all" ? undefined : value === "true",
                                    page: 1
                                })
                            }
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Featured" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">Featured</SelectItem>
                                <SelectItem value="false">Not Featured</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Data Table */}
                    <ProductsTable
                        data={products}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={(page) => setFilters({ ...filters, page })}
                        onRefresh={fetchProducts}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
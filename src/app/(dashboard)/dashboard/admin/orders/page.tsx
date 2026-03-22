"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/src/app/components/ui/button"
import { Input } from "@/src/app/components/ui/input"
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/app/components/ui/select"
import { useToast } from "@/src/app/hooks/use-toast"
import { Order } from "@/src/app/lib/types"
import { ordersApi, OrderFilters } from "@/src/app/lib/api/orders"
import { OrdersTable } from "@/src/app/components/dashboard/tables/orders-table"

export default function AdminOrdersPage() {
    const { data: session, status: sessionStatus } = useSession()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<OrderFilters>({
        page: 1,
        limit: 10,
        search: "",
        status: "",
        paymentStatus: "",
        startDate: "",
        endDate: "",
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
        if (sessionStatus === 'authenticated' && session?.user?.role === 'ADMIN') {
            fetchOrders()
        }
    }, [filters, sessionStatus, session])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            console.log('Fetching orders with filters:', filters)
            
            const response = await ordersApi.getAllOrders(filters.page, filters.limit, filters)
            console.log('API Response:', response)
            
            setOrders(response.orders || [])
            setPagination({
                page: response.page || 1,
                limit: response.limit || 10,
                total: response.total || 0,
                totalPages: response.totalPages || 0,
            })
        } catch (error: any) {
            console.error('Error fetching orders:', error)
            toast({
                title: "Error",
                description: error?.message || "Failed to load orders",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (sessionStatus === 'loading') {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (session?.user?.role !== 'ADMIN') {
        return (
            <div className="flex items-center justify-center h-full">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-red-500">Access Denied. Admin privileges required.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>

            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                    {!loading && orders.length === 0 && (
                        <p className="text-sm text-muted-foreground">No orders found.</p>
                    )}
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders..."
                                    className="pl-8"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                />
                            </div>
                        </div>
                        <Select
                            value={filters.status || "all"}
                            onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? "" : value, page: 1 })}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Order Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.paymentStatus || "all"}
                            onValueChange={(value) => setFilters({ ...filters, paymentStatus: value === "all" ? "" : value, page: 1 })}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Payment Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                                <SelectItem value="REFUNDED">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Data Table */}
                    <OrdersTable
                        data={orders}
                        loading={loading}
                        pagination={pagination}
                        onPageChange={(page) => setFilters({ ...filters, page })}
                        onRefresh={fetchOrders}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
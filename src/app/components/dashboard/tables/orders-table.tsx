/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { Input } from "../../ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Filter,
  Download,
} from "lucide-react"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { useToast } from "@/src/app/hooks/use-toast"
import { formatCurrency, formatDate } from "@/src/app/lib/utils/helpers"
import { ordersApi } from "@/src/app/lib/api/orders"
import { Order } from "@/src/app/lib/types"
import { Skeleton } from "../../ui/skeleton"

interface OrdersTableProps {
  data: Order[]
  loading?: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onRefresh: () => void
}

const statusColors = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "warning",
} as const

const paymentStatusColors = {
  PENDING: "secondary",
  PAID: "success",
  FAILED: "destructive",
  REFUNDED: "warning",
} as const

export function OrdersTable({ 
  data, 
  loading = false, 
  pagination, 
  onPageChange,
  onRefresh 
}: OrdersTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus)
      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus}`,
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderNumber",
      header: "Order",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div>
            <p className="font-medium">#{order.orderNumber || order.id.slice(-8)}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
        )
      },
    },
    {
      accessorKey: "user",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div>
            <p className="font-medium">{user?.name || 'Guest'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'No email'}</p>
          </div>
        )
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const total = row.getValue("total") as number
        return <span className="font-medium">{formatCurrency(total)}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors
        return (
          <Badge variant={statusColors[status] as any}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as keyof typeof paymentStatusColors
        return (
          <Badge variant={paymentStatusColors[status] as any}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => {
        return row.getValue("paymentMethod") || 'N/A'
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original

        const handleView = () => {
          router.push(`/admin/orders/${order.id}`)
        }

        const handleEdit = () => {
          router.push(`/admin/orders/${order.id}/edit`)
        }

        const handleUpdateStatus = (status: string) => {
          handleStatusChange(order.id, status)
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Order
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleUpdateStatus("PROCESSING")}>
                <Package className="mr-2 h-4 w-4" />
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus("SHIPPED")}>
                <Truck className="mr-2 h-4 w-4" />
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus("DELIVERED")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus("CANCELLED")}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    manualPagination: true,
    pageCount: pagination.totalPages,
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter orders..."
              value={(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("orderNumber")?.setFilterValue(event.target.value)
              }
              className="pl-10 w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="outline" size="sm">
              Bulk Actions ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum = i + 1
              if (pagination.totalPages > 5) {
                if (pagination.page > 3) {
                  pageNum = pagination.page - 3 + i
                }
              }
              return (
                <Button
                  key={pageNum}
                  variant={pagination.page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  disabled={pageNum > pagination.totalPages}
                >
                  {pageNum}
                </Button>
              )
            })}
            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
              <>
                <span className="px-2">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.totalPages)}
                >
                  {pagination.totalPages}
                </Button>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
          <Select
            value={pagination.limit.toString()}
            onValueChange={(value) => {
              // Handle page size change
              console.log("Page size:", value)
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
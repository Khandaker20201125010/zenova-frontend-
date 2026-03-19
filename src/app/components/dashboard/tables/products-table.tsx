/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
  Copy,
  Package,
  Filter,
  Download,
} from "lucide-react"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { useToast } from "@/src/app/hooks/use-toast"
import { formatCurrency, formatDate } from "@/src/app/lib/utils/helpers"
import { productsApi } from "@/src/app/lib/api/products"
import { Product } from "@/src/app/lib/types"
import { Skeleton } from "../../ui/skeleton"
import Image from "next/image"

interface ProductsTableProps {
  data: Product[]
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

export function ProductsTable({ 
  data, 
  loading = false, 
  pagination, 
  onPageChange,
  onRefresh 
}: ProductsTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  // Define the select header component separately to avoid table reference issues
  const SelectHeader = useCallback(({ table }: any) => {
    // Comprehensive check for table and its methods
    if (!table) {
      return <input type="checkbox" className="rounded border-gray-300" disabled />
    }

    // Try to safely get the selection state with error handling
    let isAllSelected = false
    let toggleAllHandler = undefined

    try {
      // Check if the method exists and is callable
      if (typeof table.getIsAllPageRowsSelected === 'function') {
        isAllSelected = table.getIsAllPageRowsSelected() ?? false
      }
      
      if (typeof table.getToggleAllPageRowsSelectedHandler === 'function') {
        toggleAllHandler = table.getToggleAllPageRowsSelectedHandler()
      }
    } catch (error) {
      // If any error occurs, return a disabled checkbox
      console.debug('Table selection methods not ready yet')
      return <input type="checkbox" className="rounded border-gray-300" disabled />
    }
    
    return (
      <input
        type="checkbox"
        className="rounded border-gray-300"
        checked={isAllSelected}
        onChange={toggleAllHandler}
      />
    )
  }, [])

  // Define the select cell component separately
  const SelectCell = useCallback(({ row }: any) => {
    // Comprehensive check for row and its methods
    if (!row) {
      return <input type="checkbox" className="rounded border-gray-300" disabled />
    }

    // Try to safely get the selection state with error handling
    let isSelected = false
    let toggleHandler = undefined

    try {
      // Check if the method exists and is callable
      if (typeof row.getIsSelected === 'function') {
        isSelected = row.getIsSelected() ?? false
      }
      
      if (typeof row.getToggleSelectedHandler === 'function') {
        toggleHandler = row.getToggleSelectedHandler()
      }
    } catch (error) {
      // If any error occurs, return a disabled checkbox
      console.debug('Row selection methods not ready yet')
      return <input type="checkbox" className="rounded border-gray-300" disabled />
    }
    
    return (
      <input
        type="checkbox"
        className="rounded border-gray-300"
        checked={isSelected}
        onChange={toggleHandler}
      />
    )
  }, [])

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "select",
        header: SelectHeader,
        cell: SelectCell,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => {
          const product = row.original
          if (!product) return null
          return (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                {product.images && product.images[0] ? (
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const price = row.getValue("price") as number
          const discountedPrice = row.original.discountedPrice
          return (
            <div>
              {discountedPrice ? (
                <div>
                  <span className="font-medium">{formatCurrency(discountedPrice)}</span>
                  <span className="text-xs text-muted-foreground line-through ml-2">
                    {formatCurrency(price)}
                  </span>
                </div>
              ) : (
                <span className="font-medium">{formatCurrency(price)}</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }) => {
          const stock = row.getValue("stock") as number
          return (
            <Badge variant={stock > 10 ? "default" : stock > 0 ? "secondary" : "destructive"}>
              {stock > 0 ? `${stock} units` : "Out of Stock"}
            </Badge>
          )
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const category = row.original.category
          return (
            <Badge variant="outline">
              {category?.name || 'Uncategorized'}
            </Badge>
          )
        },
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
          const rating = row.getValue("rating") as number
          const reviewCount = row.original.reviewCount
          return (
            <div>
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
            </div>
          )
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.getValue("isActive") as boolean
          return (
            <Badge variant={isActive ? "success" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
          return formatDate(row.getValue("createdAt"), "MMM dd, yyyy")
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const product = row.original
          if (!product) return null

          const handleEdit = () => {
            router.push(`/admin/products/${product.id}/edit`)
          }

          const handleView = () => {
            router.push(`/admin/products/${product.id}`)
          }

          const handleDelete = async () => {
            if (confirm(`Are you sure you want to delete ${product.name}?`)) {
              try {
                await productsApi.deleteProduct(product.id)
                toast({
                  title: "Product deleted",
                  description: `${product.name} has been deleted`,
                })
                onRefresh()
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to delete product",
                  variant: "destructive",
                })
              }
            }
          }

          const handleDuplicate = async () => {
            try {
              // Create a copy of the product
              const { id, createdAt, updatedAt, ...productData } = product as any
              await productsApi.createProduct({
                ...productData,
                name: `${product.name} (Copy)`,
              })
              toast({
                title: "Product duplicated",
                description: "Product has been duplicated successfully",
              })
              onRefresh()
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to duplicate product",
                variant: "destructive",
              })
            }
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
                  Edit Product
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [SelectHeader, SelectCell, router, toast, onRefresh]
  )

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
    initialState: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
  })

  // Sync pagination with parent
  useEffect(() => {
    if (table && table.getState) {
      const currentPage = table.getState().pagination.pageIndex + 1
      if (currentPage !== pagination.page) {
        table.setPageIndex(pagination.page - 1)
      }
    }
  }, [pagination.page, pagination.limit, table])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  // Safe helper functions with proper null checks
  const getRowModel = () => {
    try {
      return table?.getRowModel?.() || { rows: [] }
    } catch (error) {
      return { rows: [] }
    }
  }

  const getFilteredSelectedRowModel = () => {
    try {
      return table?.getFilteredSelectedRowModel?.() || { rows: [] }
    } catch (error) {
      return { rows: [] }
    }
  }

  const getFilteredRowModelFunc = () => {
    try {
      return table?.getFilteredRowModel?.() || { rows: [] }
    } catch (error) {
      return { rows: [] }
    }
  }

  const getColumn = (columnId: string) => {
    try {
      return table?.getColumn?.(columnId)
    } catch (error) {
      return undefined
    }
  }

  const rowModel = getRowModel()
  const filteredSelectedRowModel = getFilteredSelectedRowModel()
  const filteredRowModel = getFilteredRowModelFunc()

  const rows = rowModel.rows || []
  const filteredSelectedRows = filteredSelectedRowModel.rows || []
  const filteredRows = filteredRowModel.rows || []

  // Get header groups safely
  const headerGroups = table?.getHeaderGroups?.() || []

  return (
    <div className="space-y-4">
      {/* Table Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter products..."
              value={(getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                getColumn("name")?.setFilterValue(event.target.value)
              }
              className="pl-10 w-64"
            />
          </div>

          <Select
            value={(getColumn("isActive")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) =>
              getColumn("isActive")?.setFilterValue(value === "all" ? "" : value === "true")
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {filteredSelectedRows.length > 0 && (
            <Button variant="outline" size="sm">
              Bulk Actions ({filteredSelectedRows.length})
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
            {headerGroups.length > 0 ? (
              headerGroups.map((headerGroup) => (
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
              ))
            ) : (
              <TableRow>
                <TableHead>Loading...</TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
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
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
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
            value={pagination?.limit?.toString() || "10"}
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
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
    UserCheck,
    UserX,
    Mail,
    Filter,
    Download,
} from "lucide-react"
import { Badge } from "../../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"

import { Button } from "../../ui/button"
import { useToast } from "@/src/app/hooks/use-toast"
import { formatDate } from "@/src/app/lib/utils/helpers"
import { usersApi } from "@/src/app/lib/api/users"
import { User } from "@/src/app/lib/types"
import { Skeleton } from "../../ui/skeleton"

interface UserTableProps {
    data: User[]
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

export function UsersTable({ 
    data, 
    loading = false,
    pagination,
    onPageChange,
    onRefresh 
}: UserTableProps) {
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

    // Memoize columns to prevent unnecessary re-renders
    const columns = useMemo<ColumnDef<User>[]>(
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
                header: "User",
                cell: ({ row }) => {
                    const user = row.original
                    if (!user) return null
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                    {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => {
                    return <span className="text-sm">{row.getValue("email")}</span>
                },
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: ({ row }) => {
                    const role = row.getValue("role") as string
                    return (
                        <Badge
                            variant={
                                role === "ADMIN" ? "destructive" :
                                    role === "MANAGER" ? "secondary" : "outline"
                            }
                        >
                            {role}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.getValue("status") as string
                    return (
                        <Badge
                            variant={
                                status === "ACTIVE" ? "success" :
                                    status === "SUSPENDED" ? "destructive" : "secondary"
                            }
                        >
                            {status}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "emailVerified",
                header: "Verified",
                cell: ({ row }) => {
                    const verified = row.getValue("emailVerified") as boolean
                    return (
                        <Badge variant={verified ? "success" : "secondary"}>
                            {verified ? "Yes" : "No"}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "createdAt",
                header: "Joined",
                cell: ({ row }) => {
                    return formatDate(row.getValue("createdAt"), "MMM dd, yyyy")
                },
            },
            {
                accessorKey: "lastLogin",
                header: "Last Login",
                cell: ({ row }) => {
                    const lastLogin = row.original.lastLogin
                    return lastLogin ? formatDate(lastLogin, "MMM dd, yyyy") : "Never"
                },
            },
            {
                id: "actions",
                cell: ({ row }) => {
                    const user = row.original
                    if (!user) return null

                    const handleEdit = () => {
                        router.push(`/admin/users/${user.id}`)
                    }

                    const handleDelete = async () => {
                        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                            try {
                                await usersApi.deleteUser(user.id)
                                toast({
                                    title: "User deleted",
                                    description: `${user.name} has been deleted`,
                                })
                                onRefresh()
                            } catch (error) {
                                toast({
                                    title: "Error",
                                    description: "Failed to delete user",
                                    variant: "destructive",
                                })
                            }
                        }
                    }

                    const handleToggleStatus = async () => {
                        const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
                        try {
                            await usersApi.updateUserStatus(user.id, newStatus)
                            toast({
                                title: "Status updated",
                                description: `${user.name} is now ${newStatus}`,
                            })
                            onRefresh()
                        } catch (error) {
                            toast({
                                title: "Error",
                                description: "Failed to update status",
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
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}/orders`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleToggleStatus}>
                                    {user.status === "ACTIVE" ? (
                                        <>
                                            <UserX className="mr-2 h-4 w-4" />
                                            Suspend User
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Activate User
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete User
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

    const getSelectedRowModel = () => {
        try {
            return table?.getSelectedRowModel?.() || { rows: [] }
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

    const rowModel = getRowModel()
    const selectedRowModel = getSelectedRowModel()
    const filteredSelectedRowModel = getFilteredSelectedRowModel()
    const filteredRowModel = getFilteredRowModelFunc()

    const rows = rowModel.rows || []
    const selectedRows = selectedRowModel.rows || []
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
                            placeholder="Filter users..."
                            value={(table?.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table?.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="pl-10 w-64"
                        />
                    </div>

                    <Select
                        value={(table?.getColumn("role")?.getFilterValue() as string) ?? ""}
                        onValueChange={(value) =>
                            table?.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={(table?.getColumn("status")?.getFilterValue() as string) ?? ""}
                        onValueChange={(value) =>
                            table?.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                        }
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="SUSPENDED">Suspended</SelectItem>
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
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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
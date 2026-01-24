/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/tables/users-table.tsx
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

interface UserTableProps {
    data: any[]
    onRefresh: () => void
}

export function UsersTable({ data, onRefresh }: UserTableProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})

    const columns: ColumnDef<any>[] = [
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
            accessorKey: "user",
            header: "User",
            cell: ({ row }) => {
                const user = row.original
                return (
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                                {user.name?.split(" ").map((n: any) => n[0]).join("")}
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
                                description: "Failed to update status",
                                variant: "error",
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
                            variant: "error",
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
    })

    return (
        <div className="space-y-4">
            {/* Table Filters */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Filter users..."
                            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("email")?.setFilterValue(event.target.value)
                            }
                            className="pl-10 w-64"
                        />
                    </div>

                    <Select
                        value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
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
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
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
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={table.getState().pagination.pageIndex + 1 === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => table.setPageIndex(page - 1)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => table.setPageSize(Number(value))}
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
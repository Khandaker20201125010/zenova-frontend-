/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "../../ui/dropdown-menu"
import {
    MoreHorizontal,
    Eye,
    Trash2,
    UserCheck,
    UserX,
    Mail,
    Shield,
    UserCog,
    Users,
    CheckCircle,
    XCircle,
    Crown,
} from "lucide-react"
import { Badge } from "../../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Button } from "../../ui/button"
import { useToast } from "@/src/app/hooks/use-toast"
import { formatDate } from "@/src/app/lib/utils/helpers"
import { usersApi } from "@/src/app/lib/api/users"
import { User, UserRole } from "@/src/app/lib/types"
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

const roleConfig = {
    ADMIN: { icon: Shield, color: "destructive", label: "Admin" },
    MANAGER: { icon: UserCog, color: "secondary", label: "Manager" },
    USER: { icon: Users, color: "outline", label: "User" },
} as const

const statusConfig = {
    ACTIVE: { icon: CheckCircle, color: "success", label: "Active" },
    INACTIVE: { icon: XCircle, color: "secondary", label: "Inactive" },
    SUSPENDED: { icon: XCircle, color: "destructive", label: "Suspended" },
} as const

// Primary admin email that cannot be modified
const PRIMARY_ADMIN_EMAIL = "admin@zenova.com"

export function UsersTable({ data, loading = false, pagination, onPageChange, onRefresh }: UserTableProps) {
    const router = useRouter()
    const { toast } = useToast()
    const { data: session } = useSession()
    const [sorting, setSorting] = useState<SortingState>([])

    const isPrimaryAdmin = (email: string) => email === PRIMARY_ADMIN_EMAIL
    const isCurrentUser = (userId: string) => session?.user?.id === userId

    const handleRoleChange = async (userId: string, userName: string, email: string, newRole: UserRole) => {
        // Prevent role change for primary admin
        if (isPrimaryAdmin(email)) {
            toast({
                title: "Protected Account",
                description: "Primary admin account cannot be modified",
                variant: "destructive",
            })
            return
        }

        try {
            await usersApi.updateUserRole(userId, newRole)
            toast({ title: "Role Updated", description: `${userName} is now ${newRole}` })
            onRefresh()
        } catch {
            toast({ title: "Error", description: "Failed to update role", variant: "destructive" })
        }
    }

    const handleStatusToggle = async (user: User) => {
        // Prevent status change for primary admin
        if (isPrimaryAdmin(user.email)) {
            toast({
                title: "Protected Account",
                description: "Primary admin account cannot be suspended or deactivated",
                variant: "destructive",
            })
            return
        }

        // Prevent self-suspension
        if (isCurrentUser(user.id)) {
            toast({
                title: "Cannot Self-Modify",
                description: "You cannot suspend or deactivate your own account",
                variant: "destructive",
            })
            return
        }

        const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
        try {
            await usersApi.updateUserStatus(user.id, newStatus)
            toast({ title: "Status Updated", description: `${user.name} is now ${newStatus}` })
            onRefresh()
        } catch {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
        }
    }

    const handleDelete = async (user: User) => {
        // Prevent deletion of primary admin
        if (isPrimaryAdmin(user.email)) {
            toast({
                title: "Protected Account",
                description: "Primary admin account cannot be deleted",
                variant: "destructive",
            })
            return
        }

        // Prevent self-deletion
        if (isCurrentUser(user.id)) {
            toast({
                title: "Cannot Self-Delete",
                description: "You cannot delete your own account",
                variant: "destructive",
            })
            return
        }

        if (confirm(`Delete ${user.name}? This action cannot be undone.`)) {
            try {
                await usersApi.deleteUser(user.id)
                toast({ title: "User Deleted", description: `${user.name} has been deleted` })
                onRefresh()
            } catch {
                toast({ title: "Error", description: "Failed to delete user", variant: "destructive" })
            }
        }
    }

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: "name",
                header: "User",
                cell: ({ row }) => {
                    const user = row.original
                    const isPrimary = isPrimaryAdmin(user.email)
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                    {user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{user.name}</p>
                                    {isPrimary && (
                                        <Badge variant="default" className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                                            <Crown className="h-3 w-3" />
                                            Primary
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: ({ row }) => {
                    const role = row.getValue("role") as keyof typeof roleConfig
                    const { icon: Icon, color, label } = roleConfig[role]
                    return (
                        <Badge variant={color as any} className="gap-1">
                            <Icon className="h-3 w-3" />
                            {label}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const status = row.getValue("status") as keyof typeof statusConfig
                    const { icon: Icon, color, label } = statusConfig[status]
                    return (
                        <Badge variant={color as any} className="gap-1">
                            <Icon className="h-3 w-3" />
                            {label}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "emailVerified",
                header: "Verified",
                cell: ({ row }) => (
                    <Badge variant={row.getValue("emailVerified") ? "success" : "secondary"}>
                        {row.getValue("emailVerified") ? "Verified" : "Unverified"}
                    </Badge>
                ),
            },
            {
                accessorKey: "createdAt",
                header: "Joined",
                cell: ({ row }) => formatDate(row.getValue("createdAt"), "MMM dd, yyyy"),
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
                header: "",
                cell: ({ row }) => {
                    const user = row.original
                    const role = user.role as UserRole
                    const isProtected = isPrimaryAdmin(user.email)
                    const isSelf = isCurrentUser(user.id)

                    // If it's the primary admin, disable all actions
                    if (isProtected) {
                        return (
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled title="Protected account">
                                <MoreHorizontal className="h-4 w-4 opacity-50" />
                            </Button>
                        )
                    }

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}/orders`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <Shield className="mr-2 h-4 w-4" />
                                        Change Role
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        {Object.entries(roleConfig).map(([key, { icon: Icon, label }]) => (
                                            <DropdownMenuItem
                                                key={key}
                                                onClick={() => handleRoleChange(user.id, user.name, user.email, key as UserRole)}
                                                disabled={role === key}
                                                className={role === key ? "opacity-50" : ""}
                                            >
                                                <Icon className="mr-2 h-4 w-4" />
                                                {label}
                                                {role === key && <span className="ml-auto text-xs">✓</span>}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuItem onClick={() => handleStatusToggle(user)} disabled={isSelf}>
                                    {user.status === "ACTIVE" ? (
                                        <>
                                            <UserX className="mr-2 h-4 w-4" />
                                            Suspend
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Activate
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(user)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                },
            },
        ],
        [router, toast, onRefresh, session]
    )

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
        manualPagination: true,
        pageCount: pagination.totalPages,
        initialState: { pagination: { pageIndex: pagination.page - 1, pageSize: pagination.limit } },
    })

    useEffect(() => {
        const currentPage = table.getState().pagination.pageIndex + 1
        if (currentPage !== pagination.page) table.setPageIndex(pagination.page - 1)
    }, [pagination.page, pagination.limit, table])

    if (loading) return <Skeleton className="h-96 w-full" />

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-48 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">No users found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                        >
                            Previous
                        </Button>
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum = i + 1
                                if (pagination.totalPages > 5 && pagination.page > 3)
                                    pageNum = pagination.page - 3 + i
                                if (pageNum > pagination.totalPages) return null
                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pagination.page === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onPageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            })}
                            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                                <>
                                    <span className="px-2">...</span>
                                    <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.totalPages)}>
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
                    </div>
                </div>
            )}
        </div>
    )
}
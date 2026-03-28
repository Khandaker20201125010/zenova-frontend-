"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import { Input } from "@/src/app/components/ui/input"
import { Button } from "@/src/app/components/ui/button"
import { Search, Users, Shield, UserCog, Download, RefreshCw, AlertCircle } from "lucide-react"
import { useToast } from "@/src/app/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select"
import { Alert, AlertDescription } from "@/src/app/components/ui/alert"
import { User } from "@/src/app/lib/types"
import { UserFilters, usersApi } from "@/src/app/lib/api/users"
import { UsersTable } from "@/src/app/components/dashboard/tables/users-table"

const PRIMARY_ADMIN_EMAIL = "admin@zenova.com"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: "",
    role: "",
    status: "",
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
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersApi.getAllUsers(filters)
      setUsers(response.users || [])
      setPagination({
        page: response.page || 1,
        limit: response.limit || 10,
        total: response.total || 0,
        totalPages: response.totalPages || 0,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search, page: 1 })
  }

  const handleRoleFilter = (role: string) => {
    setFilters({ ...filters, role, page: 1 })
  }

  const handleStatusFilter = (status: string) => {
    setFilters({ ...filters, status, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  // Statistics
  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === "ADMIN").length,
    manager: users.filter(u => u.role === "MANAGER").length,
    user: users.filter(u => u.role === "USER").length,
    active: users.filter(u => u.status === "ACTIVE").length,
    inactive: users.filter(u => u.status === "INACTIVE").length,
    suspended: users.filter(u => u.status === "SUSPENDED").length,
  }

  // Check if primary admin exists
  const hasPrimaryAdmin = users.some(u => u.email === PRIMARY_ADMIN_EMAIL)

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Admins</p>
                <p className="text-xl font-bold text-destructive">{stats.admin}</p>
              </div>
              <Shield className="h-5 w-5 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Managers</p>
                <p className="text-xl font-bold text-blue-500">{stats.manager}</p>
              </div>
              <UserCog className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Users</p>
                <p className="text-xl font-bold text-green-500">{stats.user}</p>
              </div>
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Inactive</p>
                <p className="text-xl font-bold text-yellow-600">{stats.inactive}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Suspended</p>
                <p className="text-xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.role || "all_roles"}
                onValueChange={(value) => handleRoleFilter(value === "all_roles" ? "" : value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_roles">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status || "all_status"}
                onValueChange={(value) => handleStatusFilter(value === "all_status" ? "" : value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_status">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data Table */}
          <UsersTable
            data={users}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRefresh={fetchUsers}
          />
        </CardContent>
      </Card>
    </div>
  )
}
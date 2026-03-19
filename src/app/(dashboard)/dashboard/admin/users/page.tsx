"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/app/components/ui/card"
import { Input } from "@/src/app/components/ui/input"
import { Button } from "@/src/app/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useToast } from "@/src/app/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/components/ui/select"
import { User } from "@/src/app/lib/types"
import { UserFilters, usersApi } from "@/src/app/lib/api/users"
import { UsersTable } from "@/src/app/components/dashboard/tables/users-table"

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
      setUsers(response.users)
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {/* Role Filter - Fixed */}
              <Select 
                value={filters.role || "all_roles"} 
                onValueChange={(value) => handleRoleFilter(value === "all_roles" ? "" : value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_roles">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter - Fixed */}
              <Select 
                value={filters.status || "all_status"} 
                onValueChange={(value) => handleStatusFilter(value === "all_status" ? "" : value)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
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
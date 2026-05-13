"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal, Edit, Trash2, Shield } from "lucide-react"
import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate, getInitials, getStatusColor } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@treelivine.com", role: "ADMIN", department: "Management", isActive: true, lastLogin: new Date(Date.now() - 30 * 60 * 1000), createdAt: new Date("2022-01-01") },
  { id: "2", name: "Sarah Manager", email: "manager@treelivine.com", role: "MANAGER", department: "Operations", isActive: true, lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), createdAt: new Date("2022-03-15") },
  { id: "3", name: "John Accountant", email: "john@treelivine.com", role: "ACCOUNTANT", department: "Finance", isActive: true, lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), createdAt: new Date("2022-06-20") },
  { id: "4", name: "Emily Staff", email: "emily@treelivine.com", role: "STAFF", department: "Support", isActive: true, lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), createdAt: new Date("2023-01-10") },
  { id: "5", name: "Robert Wilson", email: "robert@treelivine.com", role: "MANAGER", department: "Sales", isActive: false, lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), createdAt: new Date("2022-09-05") },
  { id: "6", name: "Lisa Chen", email: "lisa@treelivine.com", role: "ACCOUNTANT", department: "Finance", isActive: true, lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000), createdAt: new Date("2023-04-22") },
]

type UserRow = typeof mockUsers[number]

const columns: Column<UserRow>[] = [
  {
    key: "name",
    header: "User",
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">{getInitials(row.name as string)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-white">{row.name as string}</p>
          <p className="text-xs text-gray-400">{row.email as string}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    sortable: true,
    render: (value) => (
      <div className="flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-gray-500" />
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(value as string)}`}>
          {value as string}
        </span>
      </div>
    ),
  },
  {
    key: "department",
    header: "Department",
    sortable: true,
    render: (value) => <span className="text-gray-300">{value as string}</span>,
  },
  {
    key: "isActive",
    header: "Status",
    sortable: true,
    render: (value) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${value ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-gray-400 bg-gray-500/10 border-gray-500/30"}`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "lastLogin",
    header: "Last Login",
    sortable: true,
    render: (value) => (
      <span className="text-gray-400 text-sm">{formatDate(value as Date)}</span>
    ),
  },
  {
    key: "createdAt",
    header: "Joined",
    sortable: true,
    render: (value) => (
      <span className="text-gray-400 text-sm">{formatDate(value as Date)}</span>
    ),
  },
]

export default function UsersPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [users, setUsers] = useState(mockUsers)
  const { toast } = useToast()

  const handleDelete = () => {
    if (deleteId) {
      setUsers(users.filter((u) => u.id !== deleteId))
      setDeleteId(null)
      toast({ title: "User removed", variant: "destructive" })
    }
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} users`}
        actions={
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DataTable
          data={users as unknown as Record<string, unknown>[]}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          searchable
          searchPlaceholder="Search users..."
          searchKeys={["name", "email", "department"]}
          rowKey={(row) => row.id as string}
          actions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-400 focus:text-red-400 focus:bg-red-500/10"
                  onClick={() => setDeleteId(row.id as string)}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </motion.div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove User"
        description="Are you sure you want to remove this user? They will lose access to the system."
        confirmLabel="Remove"
        onConfirm={handleDelete}
      />
    </div>
  )
}

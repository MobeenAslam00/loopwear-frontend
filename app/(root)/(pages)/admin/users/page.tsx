"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Download } from "lucide-react"

interface User {
  _id: string
  username: string
  email: string
  password: string
  role: "User" | "Admin"
  createdAt: string
  updatedAt: string
  __v: number
}

interface UsersResponse {
  users: User[]
  page: number
  limit: number
  totalPages: number
  totalUsers: number
}

export default function UsersTable() {
  const [usersData, setUsersData] = useState<UsersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/stats/users`)
      if (!response.ok) {
        throw new Error("Failed to fetch users data")
      }
      const data: UsersResponse = await response.json()
      setUsersData(data)
      setError(null)
    } catch (err) {
      setError("Error fetching users data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRefresh = () => {
    fetchUsers()
  }

  const handleExport = () => {
    if (!usersData) return

    const csvContent = [
      ["User ID", "Username", "Email", "Role", "Created At", "Updated At"],
      ...usersData.users.map((user) => [
        user._id,
        user.username,
        user.email,
        user.role,
        new Date(user.createdAt).toLocaleString(),
        new Date(user.updatedAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "users_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="w-full shadow-sm border-gray-200">
      <CardHeader className="bg-white pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">User Management</CardTitle>
            {usersData && (
              <p className="text-gray-600 text-sm mt-1">
                Showing {usersData.users.length} of {usersData.totalUsers} users.
              </p>
            )}
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading} className="h-9">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {/* <Button
              variant="default"
              size="sm"
              onClick={handleExport}
              disabled={!usersData || loading}
              className="h-9 bg-amber-800 hover:bg-amber-900"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-4 font-medium text-gray-700">User ID</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Username</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Created At</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-mono text-sm">{user._id.substring(0, 8)}...</td>
                    <td className="py-3 px-4 text-gray-700">{user.username}</td>
                    <td className="py-3 px-4 text-gray-700">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{formatDate(user.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


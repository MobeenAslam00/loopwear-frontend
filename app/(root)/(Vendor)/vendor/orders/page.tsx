"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Download, RefreshCw, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Product {
  productId: string
  quantity: number
  _id: string
}

interface Order {
  _id: string
  userId: string
  storeId: string
  status: string
  products: Product[]
  totalPrice: number
  createdAt: string
  updatedAt: string
  __v: number
}

interface OrderHistoryResponse {
  pageNumber: number
  limit: number
  totalRecords: number
  totalPages: number
  orders: Order[]
}

export default function VendorHistory() {
  const [orderData, setOrderData] = useState<OrderHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [storeId, setStoreId] = useState<string | null>(null)

  const fetchVendorOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get storeId from localStorage
      let storeIdFromStorage = ""

      if (typeof window !== "undefined") {
        const userString = localStorage.getItem("user")
        if (userString) {
          const user = JSON.parse(userString)
          storeIdFromStorage = user.storeId
          setStoreId(storeIdFromStorage)
        } else {
          throw new Error("User not found in local storage")
        }
      }

      if (!storeIdFromStorage) {
        throw new Error("Store ID not found in user data")
      }

      // Fetch vendor orders from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/order/all?storeId=${storeIdFromStorage}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setOrderData(data)
    } catch (err) {
      console.error("Error fetching vendor orders:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch vendor orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendorOrders()
  }, [])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy h:mm a")
  }

  const truncateId = (id: string) => {
    return id.length > 8 ? `${id.substring(0, 8)}...` : id
  }

  const handleRefresh = () => {
    fetchVendorOrders()
  }

  const handleExport = () => {
    if (!orderData) return

    const csvContent = [
      ["Order ID", "User ID", "Date Created", "Date Updated", "Status", "Products", "Total"],
      ...orderData.orders.map((order) => [
        order._id,
        order.userId,
        new Date(order.createdAt).toLocaleString(),
        new Date(order.updatedAt).toLocaleString(),
        order.status,
        order.products.map((p) => `${p.quantity}x ${p.productId}`).join(", "),
        (order.totalPrice / 100).toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vendor_orders.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p>Loading vendor orders...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <Button onClick={fetchVendorOrders} style={{ backgroundColor: "#6E391D", borderColor: "#6E391D" }}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!orderData || orderData.orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <Card className="mx-auto max-w-7xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Vendor Order History</CardTitle>
            <CardDescription>No orders found for your store.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Button onClick={handleRefresh} style={{ backgroundColor: "#6E391D", borderColor: "#6E391D" }}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="mx-auto max-w-7xl">
        <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold">Vendor Order History</CardTitle>
            <CardDescription>
              {storeId && (
                <div className="flex items-center gap-1 mt-1">
                  <Store className="h-4 w-4" />
                  <span>Store ID: {truncateId(storeId)}</span>
                </div>
              )}
              Showing {orderData.orders.length} of {orderData.totalRecords} orders for your store.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {/* <Button
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-1"
              style={{ backgroundColor: "#6E391D", borderColor: "#6E391D" }}
            >
              <Download className="h-4 w-4" />
              Export
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px] whitespace-nowrap">Order ID</TableHead>
                  <TableHead className="min-w-[120px] whitespace-nowrap">Customer ID</TableHead>
                  <TableHead className="min-w-[150px] whitespace-nowrap">Created</TableHead>
                  <TableHead className="min-w-[150px] whitespace-nowrap">Updated</TableHead>
                  <TableHead className="min-w-[100px] whitespace-nowrap">Status</TableHead>
                  <TableHead className="min-w-[100px] whitespace-nowrap">Products</TableHead>
                  <TableHead className="min-w-[100px] whitespace-nowrap text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{truncateId(order._id)}</TableCell>
                    <TableCell className="font-mono text-xs">{truncateId(order.userId)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(order.updatedAt)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={order.status === "Pending" ? "outline" : "default"}
                        className={
                          order.status === "Pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.products.map((product, index) => (
                        <div key={product._id} className="text-sm">
                          {product.quantity}x Item {truncateId(product.productId)}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-right font-medium">PKR {(order.totalPrice ).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {orderData.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                    // In a real app, you would fetch the previous page here
                  }
                }}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <div className="text-sm">
                Page {currentPage} of {orderData.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentPage < orderData.totalPages) {
                    setCurrentPage(currentPage + 1)
                    // In a real app, you would fetch the next page here
                  }
                }}
                disabled={currentPage === orderData.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


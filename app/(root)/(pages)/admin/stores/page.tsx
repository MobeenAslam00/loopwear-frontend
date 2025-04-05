"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge" 
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, RefreshCw } from "lucide-react"

interface Store {
  _id: string
  userId: string
  storeName: string
  storeDescription: string
  storeAddress: string
  ownerName: string
  email: string
  phone: string
  accountDetails: string
  storeLogo: string
  suspend: boolean
  __v: number
}

interface StoresResponse {
  stores: Store[]
  page: number
  limit: number
  totalPages: number
  totalStores: number
}

export default function StoresTable() {
  const [storesData, setStoresData] = useState<StoresResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStores = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/stats/stores`)
      if (!response.ok) {
        throw new Error("Failed to fetch stores data")
      }
      console.log(response)
      const data: StoresResponse = await response.json()

      setStoresData(data)
      setError(null)
    } catch (err) {
      setError("Error fetching stores data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const handleRefresh = () => {
    fetchStores()
  }

  const handleExport = () => {
    if (!storesData) return

    const csvContent = [
      ["Store ID", "Store Name", "Description", "Address", "Owner", "Email", "Phone", "Account Details", "Status"],
      ...storesData.stores.map((store) => [
        store._id,
        store.storeName,
        store.storeDescription,
        store.storeAddress,
        store.ownerName,
        store.email,
        store.phone,
        store.accountDetails,
        store.suspend ? "Suspended" : "Active",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "stores_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleStatusChange = async (storeId: string, suspend: boolean) => { 
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_LOOP_SERVER}/store/suspend`,
        {},
        {
          params: {
            id: storeId,
            status: suspend,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
  
      console.log("storeId", storeId, "status", suspend)
      console.log("res", response)
    
      await fetchStores() 
      setLoading(false);
  
      
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card className="w-full shadow-sm border-gray-200">
      <CardHeader className="bg-white pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Store Management</CardTitle>
            {storesData && (
              <p className="text-gray-600 text-sm mt-1">
                Showing {storesData.stores.length} of {storesData.totalStores} stores.
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
              disabled={!storesData || loading}
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
                  <th className="py-3 px-4 font-medium text-gray-700">Store ID</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Store</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Owner</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Address</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Account Details</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {storesData?.stores.map((store) => (
                  <tr key={store._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800 font-mono text-sm">{store._id.substring(0, 8)}...</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={store.storeLogo || "/placeholder.svg"}
                            alt={store.storeName}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{store.storeName}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                            {store.storeDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{store.ownerName}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-700">{store.email}</div>
                      <div className="text-xs text-gray-500">{store.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 max-w-[200px] truncate">{store.storeAddress}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 max-w-[200px] truncate">{store.accountDetails}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={store.suspend ? "destructive" : "outline"}
                          className={`${store.suspend ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "bg-green-100 text-green-800 hover:bg-green-100"}`}
                        >
                          {store.suspend ? "Suspended" : "Active"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Change status</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(store._id, false)}
                              disabled={!store.suspend}
                            >
                              Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(store._id, true)}
                              disabled={store.suspend}
                            >
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
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


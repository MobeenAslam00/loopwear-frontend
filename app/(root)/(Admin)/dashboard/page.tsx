"use client"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, Users, UserCheck, UserX, BarChart3, FileText, Loader2, Star, Trash2, AlertCircle } from "lucide-react"
import TopBanner from "@/app/components/global/top-banner"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Review {
  _id: string
  name: string
  email: string
  photos: string[]
  reviewNote: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)

  function navigate(path: string) {
    router.push(path)
  }

  // Months data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const fullMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const [chartData, setChartData] = useState<any[]>([])
  const [loadingGraph, setLoadingGraph] = useState(true)

  // Sample statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    suspendedStores: 0,
    completedOrders: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/stats/counts`)
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/reviews/all`)
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        setReviews([])
      } finally {
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [])

  // Fetch graph data
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoadingGraph(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/stats/graphData`)
        const data = await response.json()

        // Process data to count orders by month
        const monthCounts: Record<string, number> = {}

        // Initialize all months with zero
        months.forEach((month, index) => {
          monthCounts[month] = 0
        })

        // Count occurrences of each month
        data.forEach((item: any) => {
          // Get the month value from the response (e.g., "March")
          const monthValue = Object.values(item)[0] as string

          // Find the index of this month in the fullMonths array
          const monthIndex = fullMonths.findIndex((m) => m.toLowerCase() === monthValue.toLowerCase())

          if (monthIndex !== -1) {
            // Use the abbreviated month name from the months array
            const monthKey = months[monthIndex]
            monthCounts[monthKey]++
          }
        })

        // Convert to array format for Recharts
        const formattedData = months.map((month) => ({
          month,
          orders: monthCounts[month] || 0,
        }))

        setChartData(formattedData)
      } catch (error) {
        console.error("Error fetching graph data:", error)
      } finally {
        setLoadingGraph(false)
      }
    }

    fetchGraphData()
  }, [])

  // Delete review function
  const handleDeleteReview = async (reviewId: string) => {
    try {
      setDeletingReviewId(reviewId)
      await axios.delete(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/reviews/${reviewId}`)

      // Update reviews state after successful deletion
      setReviews(reviews.filter((review) => review._id !== reviewId))
      toast({
        title: "Success",
        description: "Review deleted successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    } finally {
      setDeletingReviewId(null)
    }
  }

  const logout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#F6E7DB]">
      <TopBanner />

      {/* Header with Logo and Navigation */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src="/updatedLogo.png" alt="LoopWear logo" width={120} height={50} className="object-cover " />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={logout}
            variant="outline"
            className="border-[#6b3419] text-[#6b3419] rounded-full hover:bg-[#6b3419] hover:text-white transition-colors"
          >
            logout
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-[#6b3419]/10 bg-white">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-0 rounded-md border border-[#6b3419]/20 shadow-lg bg-white"
            >
              <div className="py-3 px-4 border-b border-[#6b3419]/10">
                <p className="font-medium text-[#6b3419]">Admin</p>
              </div>
              <DropdownMenuItem
                onClick={() => navigate("/admin/users")}
                className="py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-[#6b3419]/10 hover:text-[#6b3419] focus:bg-[#6b3419]/10 focus:text-[#6b3419]"
              >
                <FileText className="h-4 w-4 text-[#6b3419]" />
                <span>View Users</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/admin/stores")}
                className="py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-[#6b3419]/10 hover:text-[#6b3419] focus:bg-[#6b3419]/10 focus:text-[#6b3419]"
              >
                <FileText className="h-4 w-4 text-[#6b3419]" />
                <span>View Stores</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Admin Welcome Banner */}
      <div className="w-full bg-[#6b3419] text-white py-10 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif">Welcome To Admin Dashboard</h2>
        </div>
      </div>

      {/* Admin Dashboard Stats */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="w-24 h-24 mb-4 bg-[#E8C5B0] rounded-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="h-12 w-12 text-[#6b3419] animate-spin" />
              ) : (
                <Users className="h-12 w-12 text-[#6b3419]" />
              )}
            </div>
            <h3 className="text-xl font-serif text-center mb-2 text-[#6b3419]">Total Users</h3>
            <p className="text-center text-2xl font-bold text-gray-700">{stats.totalUsers}</p>
          </div>

          {/* Total Sellers */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="w-24 h-24 mb-4 bg-[#E8C5B0] rounded-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="h-12 w-12 text-[#6b3419] animate-spin" />
              ) : (
                <UserCheck className="h-12 w-12 text-[#6b3419]" />
              )}
            </div>
            <h3 className="text-xl font-serif text-center mb-2 text-[#6b3419]">Total Stores</h3>
            <p className="text-center text-2xl font-bold text-gray-700">{stats.totalStores}</p>
          </div>

          {/* Suspended Sellers */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="w-24 h-24 mb-4 bg-[#E8C5B0] rounded-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="h-12 w-12 text-[#6b3419] animate-spin" />
              ) : (
                <UserX className="h-12 w-12 text-[#6b3419]" />
              )}
            </div>
            <h3 className="text-xl font-serif text-center mb-2 text-[#6b3419]">Suspended Stores</h3>
            <p className="text-center text-2xl font-bold text-gray-700">{stats.suspendedStores}</p>
          </div>

          {/* Sales Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="w-24 h-24 mb-4 bg-[#E8C5B0] rounded-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="h-12 w-12 text-[#6b3419] animate-spin" />
              ) : (
                <BarChart3 className="h-12 w-12 text-[#6b3419]" />
              )}
            </div>
            <h3 className="text-xl font-serif text-center mb-2 text-[#6b3419]">Completed Orders</h3>
            <p className="text-center text-2xl font-bold text-gray-700">{stats.completedOrders}</p>
          </div>
        </div>
      </div>

      {/* Reviews Management Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-serif mb-6 text-center text-[#6b3419]">Customer Reviews</h3>

          {loadingReviews ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-10 w-10 text-[#6b3419] animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-[#F9F3EB] rounded-lg p-6 relative">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E2CCAC] flex-shrink-0 bg-[#f0e8d9] flex items-center justify-center">
                      {review.photos && review.photos.length > 0 ? (
                        <Image
                          src={review.photos[0] || "/placeholder.svg"}
                          alt={`${review.name}'s profile`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-[#6b3419]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#6b3419] text-[#6b3419]" />
                        ))}
                      </div>
                      <p className="text-gray-700 italic mb-3 text-sm md:text-base">"{review.reviewNote}"</p>
                      <div className="font-serif font-semibold text-lg">{review.name}</div>
                      <div className="text-[#6b3419] text-xs">Customer Email: {review.email}</div>
                    </div>
                  </div>

                  {/* Display review photos in a compact gallery */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#E2CCAC87]">
                      <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                        {review.photos.map((photo, photoIndex) => (
                          <div
                            key={photoIndex}
                            className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden snap-start"
                          >
                            <Image
                              src={photo || "/placeholder.svg"}
                              alt={`Review image ${photoIndex + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delete button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
                    onClick={() => handleDeleteReview(review._id)}
                    disabled={deletingReviewId === review._id}
                  >
                    {deletingReviewId === review._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Delete review</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#F9F3EB] rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#f0e8d9] flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-[#6b3419]" />
                </div>
                <h3 className="font-serif text-xl mb-2">No Reviews Found</h3>
                <p className="text-[#6b3419] text-sm">There are no customer reviews to display at this time.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sales Chart */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-serif mb-6 text-center text-[#6b3419]">Sales Summary</h3>

          <div className="w-full h-80 relative">
            {loadingGraph ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-[#6b3419] animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} Orders`, "Orders"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#3b82f6"
                    name="Orders"
                    label={{
                      position: "top",
                      formatter: (value) => (value > 0 ? value : ""),
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <p className="text-center mt-10 text-gray-700">Sales over the year</p>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="container mx-auto px-4 mb-16">
        <div className="bg-[#6b3419]/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-serif mb-4 text-[#6b3419]">Quick Actions</h3>
          <p className="mb-6 max-w-2xl mx-auto text-gray-700">
            Manage your platform efficiently with these quick action buttons.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-[#6b3419] hover:bg-[#5a2c15] text-white px-6 py-2 rounded-full">Manage Users</Button>
            <Button className="bg-[#6b3419] hover:bg-[#5a2c15] text-white px-6 py-2 rounded-full">
              Review Products
            </Button>
            <Button className="bg-[#6b3419] hover:bg-[#5a2c15] text-white px-6 py-2 rounded-full">Manage Orders</Button>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <footer className="w-full bg-[#6b3419] py-10 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">www.loopwear.com</p>
        </div>
      </footer>
    </div>
  )
}


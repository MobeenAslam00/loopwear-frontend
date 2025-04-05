"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Trash2, Loader2, Gift } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import axios from "axios"

interface CartItem {
  _id: string
  title: string
  image: string
  price: number
  size: string
  productListing: string
  productBrand: string
  dateAdded: string
}

export default function CartTable() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [productArray, setProductArray] = useState<any>([])
  const [orderLoading, setOrderLoading] = useState(false)
  const [rewards, setRewards] = useState(0)
  const [rewardsLoading, setRewardsLoading] = useState(false)
  const [appliedRewards, setAppliedRewards] = useState(false)
  const [originalTotal, setOriginalTotal] = useState(0)
  const [discountedTotal, setDiscountedTotal] = useState(0)

  useEffect(() => {
    // Fetch cart items from localStorage
    const fetchCartItems = () => {
      setLoading(true)
      try {
        if (typeof window !== "undefined") {
          const storedItems = localStorage.getItem("cartItems")
          if (storedItems) {
            const parsedItems = JSON.parse(storedItems)
            setCartItems(parsedItems)
            console.log("parsedItems", parsedItems._id)
            setProductArray(parsedItems.map((item) => ({ productId: item._id, storeId: item.storeId, quantity: 1 })))
          }
        }
      } catch (error) {
        console.error("Error fetching cart items:", error)
        toast.error("Failed to load cart items")
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
    fetchUserRewards()
  }, [])

  // Fetch user rewards
  const fetchUserRewards = async () => {
    setRewardsLoading(true)
    try {
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        setRewardsLoading(false)
        return
      }

      const user = JSON.parse(userStr)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/order/rewards/${user.userId}`)

      if (response.data) {
        setRewards(response.data.rewards)
      }
    } catch (error) {
      console.error("Error fetching rewards:", error)
    } finally {
      setRewardsLoading(false)
    }
  }

  const removeFromCart = (_id: string) => {
    setRemovingId(_id)
    try {
      // Filter out the item to remove
      const updatedItems = cartItems.filter((item) => item._id !== _id)

      // Update state
      setCartItems(updatedItems)

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(updatedItems))
      }

      toast.success("Item removed from cart")
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast.error("Failed to remove item from cart")
    } finally {
      setRemovingId(null)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0)
  }

  useEffect(() => {
    const total = calculateTotal()
    setOriginalTotal(total)

    if (appliedRewards) {
      const discount = Math.min(rewards * 100, total)
      setDiscountedTotal(total - discount)
    } else {
      setDiscountedTotal(total)
    }
  }, [cartItems, rewards, appliedRewards])

  const applyRewards = () => {
    setAppliedRewards(true)
  }

  const cancelRewards = () => {
    setAppliedRewards(false)
  }

  if (loading) {
    return (
      <div className="w-full md:w-2/3 lg:w-3/4 xl:w-2/3 flex flex-col items-center justify-center px-4 py-16 bg-white/90 rounded-xl shadow-sm">
        <Loader2 className="w-12 h-12 animate-spin text-[#6E391D] mb-4" />
        <p className="text-[#6E391D] font-medium">Loading your cart...</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="w-full md:w-2/3 lg:w-3/4 xl:w-2/3 flex flex-col items-center justify-center px-4 py-16 bg-white/90 rounded-xl shadow-sm">
        <h1 className="text-2xl md:text-4xl font-serif font-bold mb-8 md:mb-12 tracking-wide">SHOPPING CART</h1>

        <ShoppingCart className="w-16 h-16 md:w-24 md:h-24 mb-6 md:mb-8 text-[#6E391D]" />

        <h2 className="text-xl md:text-3xl font-serif mb-4 md:mb-6">Your cart is empty!</h2>

        <div className="max-w-md text-center space-y-2 mb-6 md:mb-8 px-4">
          <p>Before proceeding to checkout you must add some products to your shopping cart.</p>
          <p>You will find a lot of interesting products on our &quot;Shop&quot; page.</p>
        </div>

        <Link
          href="/"
          className="px-6 py-3 bg-[#6E391D] text-white rounded-xl hover:bg-[#542D18] transition-colors duration-200"
        >
          Return To Shop
        </Link>
      </div>
    )
  }
  const handleCreateOrder = async () => {
    setOrderLoading(true)
    try {
      const user = localStorage.getItem("user")
      if (!user) {
        toast.error("Please login to create order.")
        setOrderLoading(false)
        return
      }

      const parsedData = JSON.parse(user)
      console.log(parsedData)

      const data = {
        userId: parsedData.userId,
        status: "Complete",
        products: productArray,
        totalPrice: Number(appliedRewards ? discountedTotal : originalTotal),
        rewardsUsage: appliedRewards,
      }

      console.log("data", data)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/order/create`, data)
      console.log("res", res)

      if (res.data) {
        toast.success("Order created successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        // Clear cart after successful order
        setCartItems([])
        localStorage.removeItem("cartItems")
      }
    } catch (e) {
      toast.error("Failed to create order. Please try again.")
      console.error("Order creation error:", e)
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div className="w-full md:w-2/3 lg:w-3/4 xl:w-2/3 flex flex-col px-4 py-8 md:py-12 bg-white/90 rounded-xl shadow-sm">
      <h1 className="text-2xl md:text-4xl font-serif font-bold mb-8 text-center tracking-wide">SHOPPING CART</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="py-4 px-2 text-left font-medium text-gray-600">Product</th>
              <th className="py-4 px-2 text-left font-medium text-gray-600 hidden md:table-cell">Type</th>
              <th className="py-4 px-2 text-left font-medium text-gray-600">Price</th>
              <th className="py-4 px-2 text-center font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id} className="border-b border-gray-200">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm md:text-base">{item.title}</h3>
                      <p className="text-xs md:text-sm text-gray-500">Size: {item.size}</p>
                      <p className="text-xs md:text-sm text-gray-500 md:hidden">Type: {item.productListing}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 hidden md:table-cell">
                  <span className="text-sm">{item.productListing}</span>
                </td>
                <td className="py-4 px-2">
                  <span className="font-medium">PKR {item.price.toLocaleString()}</span>
                </td>
                <td className="py-4 px-2 text-center">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-700 transition-colors"
                    disabled={removingId === item._id}
                    aria-label="Remove item"
                  >
                    {removingId === item._id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium">Total:</span>
          {appliedRewards ? (
            <div className="flex flex-col items-end">
              <span className="text-lg line-through text-gray-500">PKR {originalTotal.toLocaleString()}</span>
              <span className="text-xl font-bold text-green-600">PKR {discountedTotal.toLocaleString()}</span>
              <span className="text-sm text-green-600">
                (Rewards applied: {Math.min(rewards, Math.floor(originalTotal / 100))})
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold">PKR {originalTotal.toLocaleString()}</span>
          )}
        </div>

        {rewards > 0 && !appliedRewards && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-green-600 mr-2" />
              <span>You have {rewards} rewards available!</span>
            </div>
            <Button
              onClick={applyRewards}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Redeem Rewards
            </Button>
          </div>
        )}

        {appliedRewards && (
          <div className="mb-4">
            <Button
              onClick={cancelRewards}
              variant="outline"
              className="px-4 py-2 text-red-600 border-red-300 hover:bg-red-50 transition-colors duration-200"
            >
              Cancel Rewards
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href="/"
            className="px-6 py-3 bg-transparent border border-[#6E391D] text-[#6E391D] rounded-xl hover:bg-[#6E391D]/10 transition-colors duration-200 text-center"
          >
            Continue Shopping
          </Link>
          <Button
            onClick={handleCreateOrder}
            disabled={orderLoading}
            className="px-6 py-3 bg-[#6E391D] text-white rounded-xl hover:bg-[#542D18] transition-colors duration-200"
          >
            {orderLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Create Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}


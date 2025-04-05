"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { LogOut, Search, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SubHeaderProps {
  onLogout?: () => void
  showSearch?: boolean
}

export function SubHeader({ onLogout, showSearch = false }: SubHeaderProps) {
  const router = useRouter()
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    // Check localStorage for cartItems when component mounts
    const updateCartCount = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
        setCartItemsCount(Array.isArray(cartItems) ? cartItems.length : 0)
      } catch (error) {
        console.error("Error parsing cart items from localStorage:", error)
        setCartItemsCount(0)
      }
    }

    // Initial check
    updateCartCount()

    // Listen for storage events to update cart count if changed in another tab
    window.addEventListener("storage", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
    }
  }, [])

  const logout = () => {
    localStorage.clear()
    router.push("/login")
  }

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-[#FAF4EF]">
      <div className="flex justify-center items-center">
        <Image src="/updatedLogo.png" alt="Loop Wear Logo" width={240} height={50} className="h-16 w-32" />
      </div>

      {showSearch && (
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search product here"
              className="w-full pl-4 pr-10 py-2 rounded-full border-[1px] border-[#B0ABAB] bg-[#D9D9D996]"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link
          href={"/cart"}
          className="text-[#6E391D] hover:text-[#542D18] transition-colors relative"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItemsCount > 99 ? "99+" : cartItemsCount}
            </span>
          )}
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#6E391D] text-[#6E391D] hover:bg-[#6E391D] hover:text-white transition-colors"
        >
          <span className="text-sm font-medium">logout</span>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}


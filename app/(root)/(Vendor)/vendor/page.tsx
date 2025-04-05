"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Menu,
  ShoppingBag,
  Plus,
  FileText,
  Store,
  FolderClosed,
  BadgeCheck,
  BringToFront,
  Lock,
  Home,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import TopBanner from "@/app/components/global/top-banner"
import { useRouter } from "next/navigation"
import { logo } from "@/lib/data" 
import axios from "axios"

export default function VendorPage() {
  const router = useRouter()
  const [hasStore, setHasStore] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [storeName, setStoreName] = useState("Your Store Name") 
  const [storeLogo, setStoreLogo] = useState(logo)  
  const [storeStatus, setStoreStatus] = useState(false)

  function handleLogout() {
    localStorage.removeItem("user")
    router.push("/login")
  }
  const fetchUserData = async (user) => {
    try { 
      console.log('sendingtoapi',user.userId);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/user/userData`, {
        userId: user.userId
      }); 

      
      setStoreStatus( response.data.user.storeStatus)

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
 
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try { 
        const user = JSON.parse(userData)
        console.log("user", user)
        setHasStore(user.storeId)
        setIsLoggedIn(true)
        if (user.storeName) {
          setStoreName(user.storeName)
        }
        if (user.storeLogo) {
          setStoreLogo(user.storeLogo)
        }
        if (user.storeStatus) {
          setStoreStatus(user.storeStatus)
        } 
         fetchUserData(user)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setIsLoggedIn(false)
      }
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  function navigate(path: string) {
    router.push(path)
  }


  const [products, setProducts] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const limit = 10

  useEffect(() => {
    fetchProducts()
  }, [page])

  const fetchProducts = async () => {
    try {
      const user:any = localStorage.getItem("user")
      const parsedUser = JSON.parse(user)
      if (!parsedUser.userId) throw new Error("User ID not found")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/getAllProductsByUserId?userId=${parsedUser?.userId}&limit=${limit}&page=${page}`,
      )
 
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json() 
      console.log(data.products);
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Refresh products list
      fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product")
    }
  }

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-[#fdf6ef]">
      <TopBanner />

      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-black rounded-full w-14 h-14 flex items-center justify-center overflow-hidden">
            <Image
              src={storeLogo || "/placeholder.svg"} // Use storeLogo if available, otherwise fallback to default logo
              alt={`${storeName} logo`}
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-serif tracking-tight">{storeName}</h1> {/* Display dynamic store name */}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Button
              variant="outline"
              className="border-[#6b3419] text-[#6b3419] rounded-full hover:bg-[#6b3419] hover:text-white transition-colors"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-[#6b3419] text-[#6b3419] rounded-full hover:bg-[#6b3419] hover:text-white transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
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
                <p className="font-medium text-[#6b3419]">LoopWear</p>
              </div>
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className={`py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-[#6b3419]/10 hover:text-[#6b3419] focus:bg-[#6b3419]/10 focus:text-[#6b3419]`}
              >
                <Home className="h-4 w-4 text-[#6b3419]" />
                <span>Home</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => hasStore && !storeStatus && navigate("/vendor/products")}
                disabled={!hasStore || !isLoggedIn || storeStatus}
                className={`py-3 px-4 flex items-center gap-2 ${hasStore && isLoggedIn && !storeStatus ? "cursor-pointer hover:bg-[#6b3419]/10 hover:text-[#6b3419] focus:bg-[#6b3419]/10 focus:text-[#6b3419]" : "cursor-not-allowed opacity-60"}`}
              >
                {(!hasStore || !isLoggedIn || storeStatus) && <Lock className="h-4 w-4 text-[#6b3419]" />}
                <ShoppingBag className="h-4 w-4 text-[#6b3419]" />
                <span>View Products</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => hasStore && !storeStatus && navigate("/add-dress")}
                disabled={!hasStore || !isLoggedIn || storeStatus}
                className={`py-3 px-4 flex items-center gap-2 ${hasStore && isLoggedIn && !storeStatus ? "cursor-pointer hover:bg-[#6b3419]/10 hover:text-[#6b3419] focus:bg-[#6b3419]/10 focus:text-[#6b3419]" : "cursor-not-allowed opacity-60"}`}
              >
                {(!hasStore || !isLoggedIn || storeStatus) && <Lock className="h-4 w-4 text-[#6b3419]" />}
                <Plus className="h-4 w-4 text-[#6b3419]" />
                <span>Add Product</span>
              </DropdownMenuItem>
             
              <DropdownMenuItem
                onClick={() => !hasStore && !storeStatus && navigate("/create-store")}
                disabled={!isLoggedIn || hasStore || storeStatus}
                className={`py-3 px-4 flex items-center gap-2 ${isLoggedIn && !hasStore && !storeStatus ? "cursor-pointer hover:bg-[#6b3419]/10 hover:text-[#6b3419] focus:bg-[#6b3419]/10 focus:text-[#6b3419]" : "cursor-not-allowed opacity-60"}`}
              >
                {(!isLoggedIn || hasStore || storeStatus) && <Lock className="h-4 w-4 text-[#6b3419]" />}
                <Store className="h-4 w-4 text-[#6b3419]" />
                <span>Create Store</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/vendor/orders")}
                disabled={!isLoggedIn || !hasStore || storeStatus}
                className={`py-3 px-4 flex items-center gap-2 ${isLoggedIn && hasStore && !storeStatus ? "cursor-pointer hover:bg-[#6b3419]/10 hover:text-[#6b3419] focus:bg-[#6b3419]/10 focus:text-[#6b3419]" : "cursor-not-allowed opacity-60"}`}
              >
                {(!isLoggedIn || !hasStore || storeStatus) && <Lock className="h-4 w-4 text-[#6b3419]" />}
                <Store className="h-4 w-4 text-[#6b3419]" />
                <span>View Orders</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Vendor Welcome Banner */}
      <div className="w-full bg-[#6b3419] text-white py-10 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif">Welcome To Your Store</h2>
        </div>
      </div>

      {/* Store Suspension Banner */}
      {storeStatus && (
        <div className="w-full bg-red-600 text-white py-6 mb-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-serif">Your Store Has Been Suspended</h2>
            <p className="mt-2">Please review our vendor policy for more information.</p>
          </div>
        </div>
      )}

      {/* Vendor Dashboard */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Extra Earning */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="w-24 h-24 mb-6">
              {/* <BringToFront className="h-24 w-24 text-[#6b3419] mb-6" /> */}
              <Image alt="logo" src={'/admin/user.png'} height={24} width={24} className="h-24 w-24 text-[#6b3419] mb-6" />
            </div>
            <h3 className="text-xl font-serif text-center mb-4 text-[#6b3419]">Extra Dresses = Extra Earning</h3>
            <p className="text-center text-sm leading-relaxed text-gray-700">
              Your preloved dresses may be a treasure that someone might be looking for. Help other people have their
              fairytale events by lending. The best part... not only do you get good deeds for helping, you also earn
              while sitting at home.
            </p>
          </div>

          {/* Closet Space */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="w-24 h-24 mb-6">
              {/* <FolderClosed className="h-24 w-24 text-[#6b3419] mb-6" /> */}
              <Image alt="logo" src={'/admin/summ.png'} height={24} width={24} className="h-24 w-24 text-[#6b3419] mb-6" />
            </div>
            <h3 className="text-xl font-serif text-center mb-4 text-[#6b3419]">Who doesn't love more closet space?</h3>
            <p className="text-center text-sm leading-relaxed text-gray-700">
              Heavy and Bridal Wear takes up so much space and is hardly worn thrice. Free your Closet space and earn
              from your extra clothes
            </p>
          </div>

          {/* Lending Process */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="w-24 h-24 mb-6">
              {/* <BadgeCheck className="h-24 w-24 text-[#6b3419] mb-6" /> */}
              <Image alt="logo" src={'/admin/susp.png'} height={24} width={24} className="h-24 w-24 text-[#6b3419] mb-6" />
            </div>
            <h3 className="text-xl font-serif text-center mb-4 text-[#6b3419]">Effortless Lending process</h3>
            <p className="text-center text-sm leading-relaxed text-gray-700">
              You can also sell the dress in addition to lending. User-friendly interface and guide help you to manage
              your store without effort and seamlessly lend dresses and manage orders.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-[#6b3419]/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-serif mb-4 text-[#6b3419]">Ready to start earning?</h3>
          <p className="mb-6 max-w-2xl mx-auto text-gray-700">
            {!isLoggedIn
              ? "Login to your account to start listing your dresses and earning extra income."
              : !hasStore
                ? "Create your store first to start listing your dresses and earning extra income."
                : "List your first dress today and join our community of fashion entrepreneurs making extra income from their wardrobe."}
          </p>
          <Button
            className="bg-[#6b3419] hover:bg-[#5a2c15] text-white px-8 py-6 rounded-full text-lg"
            onClick={() => {
              if (!isLoggedIn) {
                navigate("/login")
              } else if (hasStore && !storeStatus) {
                navigate("/add-dress")
              } else if (!storeStatus) {
                navigate("/create-store")
              } else {
                navigate("/lender") // Navigate to vendor policy if suspended
              }
            }}
            disabled={isLoggedIn && hasStore && storeStatus}
          >
            {!isLoggedIn
              ? "Login to Your Account"
              : hasStore
                ? storeStatus
                  ? "View Vendor Policy"
                  : "Add Your Product"
                : "Create Your Store"}
          </Button>
        </div>
      </div>

      {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-24 py-16">
            {products.map((product:any) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.productName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                  </div>
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.productListing}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.productName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.productBrand}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">PKR {product.productPrice.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{product.productSize}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Footer */}
      <footer className="w-full bg-[#6b3419] py-10 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-80">© 2025 {storeName}. All rights reserved.</p>{" "}
          {/* Dynamic store name in footer */}
        </div>
      </footer>
    </div>
  )
}


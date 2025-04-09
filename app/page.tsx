"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, ChevronLeft, ChevronRight, Star, User } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import ProductsSection from "./components/Home/ui/products-section"
import VideoSection from "./components/Home/ui/video-section"
import AboutSection from "./components/Home/ui/about-section"
import LoopWearBanner from "./components/Home/ui/loopwear-banner"
import TopBanner from "./components/global/top-banner"
import HeaderDropdown from "./components/global/header-dropdwon"
import { logo } from "@/lib/data"

interface Review {
  _id: string
  name: string
  email: string
  photos: string[]
  reviewNote: string
}

function ReviewsSectionComponent() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/reviews/all`)
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      // Loop to the end
      setCurrentIndex(reviews.length - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Loop to the beginning
      setCurrentIndex(0)
    }
  }

  return (
    <section className="py-12 px-4 sm:px-6 md:px-12 bg-[#f9f3eb]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-4">What Our Customers Say</h2>
          <p className="text-[#6d4534] max-w-2xl mx-auto">
            Discover why fashion enthusiasts choose Loop Wear for sustainable style solutions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6d4534]"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="relative">
            <div className="overflow-hidden" ref={sliderRef}>
              <div
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                <div className="flex">
                  {reviews.map((review, index) => (
                    <div
                      key={review._id}
                      className={`w-full flex-shrink-0 ${index === currentIndex ? "block" : "hidden"} md:block`}
                    >
                      <div className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-2xl">
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
                              <User className="w-6 h-6 text-[#6d4534]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-[#6d4534] text-[#6d4534]" />
                              ))}
                            </div>
                            <p className="text-gray-700 italic mb-3 text-sm md:text-base">"{review.reviewNote}"</p>
                            <div className="font-serif font-semibold text-lg">{review.name}</div>
                            <div className="text-[#6d4534] text-xs">Verified Customer</div>
                          </div>
                        </div>

                        {/* Display review photos in a more compact gallery */}
                        {review.photos && review.photos.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#E2CCAC87]">
                            <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                              {review.photos.map((photo, photoIndex) => (
                                <div
                                  key={photoIndex}
                                  className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-md overflow-hidden snap-start"
                                >
                                  <Image
                                    src={photo || "/placeholder.svg"}
                                    alt={`Review image ${photoIndex + 1}`}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0 bg-white rounded-full p-2 shadow-md hover:bg-[#f0e8d9] transition-colors z-10"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5 text-[#6d4534]" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0 bg-white rounded-full p-2 shadow-md hover:bg-[#f0e8d9] transition-colors z-10"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5 text-[#6d4534]" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center mt-6 gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-[#6d4534]" : "bg-[#E2CCAC]"}`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#f0e8d9] flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-[#6d4534]" />
              </div>
              <h3 className="font-serif text-xl mb-2">No Reviews Yet</h3>
              <p className="text-[#6d4534] text-sm">Be the first to share your experience with Loop Wear!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [rewards, setRewards] = useState(0)
  const [store,setStore] = useState(false)

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (!userData) {
          console.error("No user data found in localStorage");
          setRewards(0);
          return;
        }
    
        const parsedUser = JSON.parse(userData);
        const id = parsedUser.userId;
        if(parsedUser && parsedUser?.store == true){
          setStore(true)
        } 
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/order/rewards/${id}`)
        const data = await response.json()
        setRewards(data.rewards || 0)
      } catch (error) {
        console.error("Error fetching rewards:", error)
        setRewards(0)
      }
    }

    fetchRewards()

    const intervalId = setInterval(fetchRewards, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")
        setCartItemsCount(Array.isArray(cartItems) ? cartItems.length : 0)
      } catch (error) {
        console.error("Error parsing cart items from localStorage:", error)
        setCartItemsCount(0)
      }
    }

    updateCartCount()

    window.addEventListener("storage", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
    }
  }, [])
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Top Banner */}
        <TopBanner />

        {/* Header */}
        <header className="bg-[#f9f3eb] py-3 px-4 sm:py-4 sm:px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
            <Image
              src="/updatedLogo.png"
              alt="LoopWear logo"
              width={120}
              height={50}
              className="object-cover "
            />              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center">
              <div className="relative mr-4">
                <div className="flex items-center gap-1">
                  <div className="bg-gradient-to-r from-[#6d4534] to-[#8a5a45] text-white px-3 py-1 rounded-full flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-yellow-300 text-yellow-300" />
                    <span className="font-medium">{rewards}</span>
                  </div>
                  <div className="text-xs text-[#6d4534] hidden sm:block">Rewards</div>
                </div>
              </div>
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
            </div>
            <HeaderDropdown />
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-[#f9f3eb] border-b border-[#E2CCAC87] py-2 px-4 sm:px-6 md:px-12 overflow-x-auto">
          <ul className="flex justify-center gap-2 sm:gap-4 md:gap-8 min-w-max mx-auto">
            <li>
              <Link
                href="/"
                className="px-2 sm:px-4 py-1  border-2 border-black rounded-full text-[#6d4534] text-sm sm:text-base whitespace-nowrap"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products?type=rent"
                className="px-2 sm:px-4 py-1 underline text-sm sm:text-base whitespace-nowrap"
              >
                Renter
              </Link>
            </li>
            <li>
              <Link
                href={store ? "/vendor" : "/become-vendor"}
                className="px-2 sm:px-4 py-1 underline text-sm sm:text-base whitespace-nowrap"
              >
                lender
              </Link>
            </li>
            <li>
              <Link href="/login" className="px-2 sm:px-4 py-1 underline text-sm sm:text-base whitespace-nowrap">
                Register
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-[#f0e8d9] overflow-hidden">
          <div className="h-full flex flex-col md:flex-row items-center">
            {/* Left Content */}
            <div className="w-full md:w-2/5 p-4 sm:p-6 md:p-12 text-center md:text-left flex flex-col justify-center">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-3 md:mb-4">
                Fashion That Circulates, Style That Lasts.
              </h1>
              <p className="text-[#6d4534] mb-6 md:mb-8 text-base sm:text-lg">
                Rent. Wear. Return. Repeat — Sustainable Fashion at Your Fingertips.
              </p>
              <div>
                <Link href={'/products?type=rent'} className="bg-[#6d4534] text-white px-4 sm:px-6 py-2 sm:py-3 rounded hover:bg-[#5a3a2c] transition-colors text-sm sm:text-base">
                  Explore Now
                </Link>
              </div>
            </div>

            {/* Right Content - Images */}
            <div className="w-full md:w-3/5 h-[50vh] md:h-full relative flex items-end justify-center overflow-hidden">
              <div className="flex h-full w-full">
                {/* Arch 1 */}
                <div className="relative w-[30%] h-full">
                  <div className="absolute bottom-0 w-full h-[85%] rounded-t-full overflow-hidden">
                    <div className="absolute inset-0 bg-[#2a1e17]"></div>
                    <div className="absolute inset-0 flex items-end justify-center">
                      <Image
                        src="https://res.cloudinary.com/dklqbx5k0/image/upload/v1741306556/hibieafdrkpyzq3msduk.png"
                        alt="Fashion model in pink outfit"
                        width={300}
                        height={600}
                        className="object-cover h-full w-full"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Arch 3 */}
                <div className="relative w-[30%] h-full">
                  <div className="absolute bottom-0 w-full h-[90%] rounded-t-full overflow-hidden">
                    <div className="absolute inset-0 bg-[#2a1e17]"></div>
                    <div className="absolute inset-0 flex items-end justify-center">
                      <Image
                        src="https://res.cloudinary.com/dklqbx5k0/image/upload/v1741306566/i13jlkfcjaj0thvcceae.png"
                        alt="Fashion model in brown outfit with red dupatta"
                        width={350}
                        height={700}
                        className="object-cover h-full w-full"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Arch 2 */}
                <div className="relative w-[30%] h-full">
                  <div className="absolute bottom-0 w-full h-[95%] rounded-t-full overflow-hidden">
                    <div className="absolute inset-0 bg-[#2a1e17]"></div>
                    <div className="absolute inset-0 flex items-end justify-center">
                      <Image
                        src="https://res.cloudinary.com/dklqbx5k0/image/upload/v1741306567/mvlwxe7qdijkiuimfklm.png"
                        alt="Fashion model in beige outfit"
                        width={350}
                        height={700}
                        className="object-cover h-full w-full"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <ProductsSection />
      <VideoSection />
      <AboutSection />
      <ReviewsSectionComponent />
      <LoopWearBanner />
    </>
  )
}


"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ClothingCard } from "./clothing-card"
import { useState,useEffect } from "react"


interface ProductSliderProps {
  products?: any
}

export function ProductSlider({}: ProductSliderProps) {

  const [products,setProducts] = useState<any>([])
  const fetchProducts = async () => {

    try {

      let url = `${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/getAllProducts?limit=5&page=1`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.log("Error fetching products:", err)
    } 
  }

  useEffect(() => {
    fetchProducts()
  }, [])


  
  return (
    <div className="py-12 px-4 bg-[#FAF4EF]">
      <h2 className="text-4xl font-serif text-center mb-8">You May Also Like</h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-7xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products && products.map((product:any) => (
            <CarouselItem key={product._id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <ClothingCard
                productId={product._id}
                imageUrl={product.images[0]}
                title={product.productName}
                price={product.productPrice}
                action={product.productListing}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 border-[#6E391D] text-[#6E391D] hover:bg-[#6E391D] hover:text-white" />
        <CarouselNext className="hidden md:flex -right-12 border-[#6E391D] text-[#6E391D] hover:bg-[#6E391D] hover:text-white" />
      </Carousel>
    </div>
  )
}


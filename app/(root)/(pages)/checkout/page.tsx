"use client"

import TopBanner from "@/app/components/global/top-banner"
import { Toaster } from "@/components/ui/toaster"
import { SubHeader } from "@/app/components/global/sub-header"
import { ProductSlider } from "@/app/components/global/product-slider"
import FooterBanner from "@/app/components/global/footer-banner"
import { products } from "@/lib/data"
import { BuyNowCheckout } from "./component/buy-now"



export default function Checkout() {
    const handleCheckout = async (paymentMethod: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log("Processing checkout with payment method:", paymentMethod)
      }

  return (
    <div className="min-h-screen bg-[#FAF4EF] ">
      <TopBanner back={true} />
      <SubHeader showSearch={true}/>
      <br/>
      <BuyNowCheckout
        productImage="https://zuriador.com/cdn/shop/files/zuria-dor-dusty-beige-bridal-dress-2.jpg?v=1724221215&width=1200"
        productTitle="Three piece non-bridal festive wear"
        rentAmount={4000}
        onCheckout={handleCheckout}
      />
      <ProductSlider products={products}/>
      <FooterBanner/>
      <Toaster />
    </div>
  )
}

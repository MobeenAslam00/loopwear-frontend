"use client"

import { SubHeader } from "@/app/components/global/sub-header"
import TopBanner from "@/app/components/global/top-banner"
import CartTable from "./component/cart-table"
import FooterBanner from "@/app/components/global/footer-banner"
import { ProductSlider } from "@/app/components/global/product-slider"
import { RenterPolicyBanner } from "@/app/components/global/renter-policy-banner"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const CartPage = () => {
  const products = [
    {
      id: 1,
      imageUrl: "https://zuriador.com/cdn/shop/files/zuria-dor-dusty-beige-bridal-dress-2.jpg?v=1724221215&width=1200",
      title: "Festive Orange Suit",
      price: 5000,
      action: "Lend" as const,
    },
    {
      id: 2,
      imageUrl: "https://zuriador.com/cdn/shop/files/zuria-dor-dusty-beige-bridal-dress-2.jpg?v=1724221215&width=1200",
      title: "Casual Summer Dress",
      price: 3200,
      action: "Rent" as const,
    },
    {
      id: 3,
      imageUrl: "https://zuriador.com/cdn/shop/files/zuria-dor-dusty-beige-bridal-dress-2.jpg?v=1724221215&width=1200",
      title: "Elegant Embroidered Kurta",
      price: 4500,
      action: "Lend" as const,
    },
    {
      id: 4,
      imageUrl: "https://zuriador.com/cdn/shop/files/zuria-dor-dusty-beige-bridal-dress-2.jpg?v=1724221215&width=1200",
      title: "Party Wear Gown",
      price: 12000,
      action: "Rent" as const,
    },
  ]
  return (
    <div className="bg-[#FAF4EF] min-h-screen">
      <TopBanner back={true} />
      <SubHeader showSearch={false} />
      <div className="flex justify-center items-center my-8 px-4">
        <CartTable />
      </div>
      <ProductSlider products={products} />
      <RenterPolicyBanner />
      <FooterBanner />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default CartPage


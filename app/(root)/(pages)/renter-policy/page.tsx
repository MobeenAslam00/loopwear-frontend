import FooterBanner from '@/app/components/global/footer-banner'
import { ProductSlider } from '@/app/components/global/product-slider'
import RentersPolicy from '@/app/components/global/renter-policy'
import TopBanner from '@/app/components/global/top-banner'
import { products } from '@/lib/data'
import React from 'react'

const page = () => {
  return (
    <main className="h-screen bg-[#FAF4EF]">
      <TopBanner back={true} />
        <div className="w-full bg-[#F6E7DB]">
          <RentersPolicy />
        </div>
        <ProductSlider products={products}/>
        <FooterBanner/>
    </main>
  )
}

export default page
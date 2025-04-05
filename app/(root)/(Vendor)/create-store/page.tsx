import TopBanner from '@/app/components/global/top-banner'
import React from 'react'
import { CreateStoreForm } from '../components/create-store-form'
import FooterBanner from '@/app/components/global/footer-banner'

const page = () => {
  return (
    <div>
        <TopBanner back={true} />
        <CreateStoreForm/>
        <FooterBanner/>
    </div>
  )
}

export default page
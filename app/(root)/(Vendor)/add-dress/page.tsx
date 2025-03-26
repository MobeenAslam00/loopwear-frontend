import TopBanner from "@/app/components/global/top-banner"
import { AddDressForm } from "../components/add-dress-form"
import { Toaster } from "@/components/ui/toaster"
import FooterBanner from "@/app/components/global/footer-banner"

export default function AddDressPage() {
  return (
    <>
      <TopBanner back={true}/>
      <AddDressForm />
      <Toaster />
      <FooterBanner/>
    </>
  )
}


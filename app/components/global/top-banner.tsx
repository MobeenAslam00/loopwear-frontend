'use client'
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BannerProps {
  back?: boolean
}

const TopBanner = ({ back = false }: BannerProps) => {
    const router = useRouter()
  return (
    <div className="bg-[#6E391D]  text-white py-2 h-[69px] flex items-center">
      {back && (
        <p onClick={()=> router.back()} className="ml-4 cursor-pointer">
          <ArrowLeft size={24} />
        </p>
      )}
      <p className="font-light text-[20px] leading-[100%] tracking-[0] text-center flex-1">Glad to Have You! Stay Stylish, Spend Smart</p>
    </div>
  )
}

export default TopBanner


import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, RefreshCw, Users } from "lucide-react"
import StepsGuide from "./component/steps-guide"
import LenderPolicy from "./component/lender-policy"
import FooterBanner from "@/app/components/global/footer-banner"
import TopBanner from "@/app/components/global/top-banner"
import { SubHeader } from "@/app/components/global/sub-header"
import Link from "next/link"

export default function LandingPageWithBenefits() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E2CCAC47" }}>
       <TopBanner back={true} />
        {/* <SubHeader/> */}
      <div className=" mx-auto px-4 py-12">
        {/* Hero section */}
        <div className="flex flex-col items-center text-center mb-16">
          <Link href={'/vendor'}>
          <Button
            className="text-xl font-medium px-8 py-6 rounded-full text-white mb-8"
            style={{ backgroundColor: "#5F2F16" }}
          >
            Become a Lender
          </Button>
          </Link>


          <h1 className="text-3xl md:text-4xl font-medium text-[#5F2F16] mb-12">Join the community of Happy Lenders</h1>

          <div className="w-full max-w-5xl rounded-lg overflow-hidden shadow-xl ">
            <Image
              src="https://res.cloudinary.com/dklqbx5k0/image/upload/v1741397248/kjomp2cfy2xowpmjjwbj.png"
              alt="Colorful clothing items on wooden racks"
              width={1200}
              height={600}
              className="w-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Benefits section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-medium text-center text-[#5F2F16] mb-10">
            Benefits of Becoming a Lender
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-[#5F2F16] p-2 rounded-full text-white mt-1">
                <RefreshCw size={20} />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#5F2F16]">Circular Fashion</h3>
                <p className="text-[#5F2F16]/80">
                  Participate in the circular economy by extending the lifecycle of your clothing items.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#5F2F16] p-2 rounded-full text-white mt-1">
                <Leaf size={20} />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#5F2F16]">Eco-Friendly</h3>
                <p className="text-[#5F2F16]/80">
                  Reduce fashion waste and environmental impact by sharing instead of buying new.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#5F2F16] p-2 rounded-full text-white mt-1">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#5F2F16]">Community</h3>
                <p className="text-[#5F2F16]/80">
                  Connect with like-minded fashion enthusiasts in your local community.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#5F2F16] p-2 rounded-full text-white mt-1">
                <ArrowRight size={20} />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#5F2F16]">Extra Income</h3>
                <p className="text-[#5F2F16]/80">
                  Turn your closet into a source of passive income by lending items you don't wear often.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Guide */}
        <StepsGuide />

        {/* Lender Policy */}
        <LenderPolicy />

        {/* CTA section */}
        <div className="text-center max-w-2xl mx-auto py-12">
          <h2 className="text-2xl md:text-3xl font-medium mb-4 text-[#5F2F16]">Ready to share your wardrobe?</h2>
          <p className="text-[#5F2F16]/80 mb-8">
            Join thousands of lenders who are already sharing their style and making a difference.
          </p>
          <Link href={'/vendor'}>
          <Button
            className="text-lg font-medium px-8 py-6 rounded-full text-white"
            style={{ backgroundColor: "#5F2F16" }}
          >
            Become a Lender Today
          </Button>
          </Link>
        </div>
      </div>

      {/* Footer Banner */}
      <FooterBanner />
    </div>
  )
}


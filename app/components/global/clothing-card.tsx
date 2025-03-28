import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"



export function ClothingCard({ imageUrl, title, productId, category, price, action, alt }: any) {
  return (
    <Card className="overflow-hidden max-w-sm w-full shadow-md rounded-2xl transition-all duration-300 hover:shadow-lg border-0">
      <Link href={`/description/${productId}`}>
        <div className="relative">
          {/* Action badge */}
          <Badge
            className={`absolute right-3 top-3 z-10 ${
              action === "sale"
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : action === "rent"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "bg-purple-100 text-purple-800 hover:bg-purple-200"
            }`}
          >
            {action}
          </Badge>

          <Badge className="absolute left-3 top-3 z-10 bg-white/80 text-black backdrop-blur-sm hover:bg-white">
            {category}
          </Badge>

          <div className="relative rounded-t-2xl h-80 md:h-96 w-full overflow-hidden group">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={alt || title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <CardContent className="p-4 text-center bg-[#F6E7DB]">
          <h3 className="text-sm md:text-base font-medium text-[#542D18] line-clamp-2 min-h-[2.5rem]">{title}</h3>
        </CardContent>

        <CardFooter className="flex justify-center pb-4 pt-2 bg-[#F6E7DB]">
          <div className="bg-[#6E391D] rounded-xl px-5 py-2 text-white text-sm md:text-base font-medium shadow-sm">
            PKR {price.toLocaleString()}
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}


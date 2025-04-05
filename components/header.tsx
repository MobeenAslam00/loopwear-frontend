import Link from "next/link"
import { Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative h-16 w-48">
            <span className="font-playfair text-2xl">LoopWear</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 rounded-full">
            <span>logout</span>
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="container mx-auto px-4 py-4">
        <ul className="flex justify-center gap-8">
          <li>
            <Link href="/" className="px-4 py-2 rounded-full bg-secondary text-primary font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link href="/renter" className="px-4 py-2 text-primary/80 hover:text-primary">
              Renter
            </Link>
          </li>
          <li>
            <Link href="/lender" className="px-4 py-2 text-primary/80 hover:text-primary">
              Lender
            </Link>
          </li>
          <li>
            <Link href="/register" className="px-4 py-2 text-primary/80 hover:text-primary">
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}


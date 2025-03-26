import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>www.loopwear.com</p>
        <div className="mt-4 flex justify-center gap-8">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
        <p className="mt-6 text-sm opacity-80">© {new Date().getFullYear()} LoopWear. All rights reserved.</p>
      </div>
    </footer>
  )
}


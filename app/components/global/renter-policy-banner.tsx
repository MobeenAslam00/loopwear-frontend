
import Link from "next/link"

export function RenterPolicyBanner() {
  return (
    <div className="w-full py-8 text-center" style={{ backgroundColor: "#6E391D82" }}>
      <div className="max-w-3xl mx-auto space-y-2">
        <h2 className="text-2xl md:text-3xl font-serif text-black">Stick to Render&apos;s Policy</h2>
        <p className="text-lg md:text-xl font-serif text-black">for Save and Secure Renting Process</p>

        <Link
          href={'/renter-policy'}
          className="mt-4 text-white/90 hover:text-white transition-colors underline underline-offset-4 font-serif"
        >
          Renter Policy
        </Link>
      </div>
    </div>
  )
}

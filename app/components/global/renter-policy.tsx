import { X } from 'lucide-react'

interface RentersPolicyProps {
  onClose?: () => void
}

export default function RentersPolicy({ onClose }: RentersPolicyProps) {
  return (
    <div className="max-w-3xl mx-auto p-8 rounded-lg relative" style={{ backgroundColor: "#F6E7DB" }}>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Close policy"
      >
        <X className="h-6 w-6 text-[#542D18]" />
      </button>
      
      <h1 className="text-4xl font-serif text-center font-bold mb-8">Renter's Policy</h1>

      <ul className="space-y-4 text-lg">
        <li className="flex items-start">
          <span className="mr-2 text-xl">•</span>
          <span>
            Renters must return items within the agreed rental period. Late returns may result in additional charges.
          </span>
        </li>

        <li className="flex items-start">
          <span className="mr-2 text-xl">•</span>
          <span>
            Renters are responsible for handling garments with care. Items should be returned in the same condition as
            received.
          </span>
        </li>

        <li className="flex items-start">
          <span className="mr-2 text-xl">•</span>
          <span>
            In case of significant damage or loss, renters may be liable for repair costs or full replacement value.
          </span>
        </li>

        <li className="flex items-start">
          <span className="mr-2 text-xl">•</span>
          <span>
            Renters must ensure garments are clean and free from stains or odors upon return. Minor wear is acceptable.
          </span>
        </li>

        <li className="flex items-start">
          <span className="mr-2 text-xl">•</span>
          <span>
            Renters can cancel bookings within 24 hours of the order. Late cancellations may result in a partial refund.
          </span>
        </li>

        <li className="flex items-start">
          <span className="mr-2 text-xl">•</span>
          <span>
            No permanent alterations are allowed. Temporary adjustments (e.g., pinning) must be removed before
            returning.
          </span>
        </li>
      </ul>
    </div>
  )
}

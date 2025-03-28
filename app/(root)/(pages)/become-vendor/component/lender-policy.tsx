export default function LenderPolicy() {
    return (
      <div

        className="w-full py-12 px-4 md:px-8"
        style={{ backgroundColor: "#F6E7DB" }} // Creamy background
      >
        <div className="max-w-4xl mx-auto font-serif">
          {/* Heading */}
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            style={{ color: "#5F2F16" }}
          >
            Lender's Policy
          </h2>
  
          {/* Policy Text */}
          <div className="space-y-4 leading-relaxed" style={{ color: "#5F2F16" }}>
            <p>Lenders must ensure all items are clean, damage-free, and accurately described before listing.</p>
            <p>Only genuine and legally owned clothing can be listed. Counterfeit items are strictly prohibited.</p>
            <p>
              Lenders set rental prices and durations, but rates should reflect the item's condition and market
              value.
            </p>
            <p>Lenders may charge a reasonable fee for significant damage or loss beyond normal wear and tear.</p>
            <p>Lenders must allow cancellations up to 24 hours before the rental period begins.</p>
            <p>Items must be returned by renters in the condition received. Late returns may incur additional fees.</p>
            <p>Items must be cleaned or sanitized between rentals to ensure quality and hygiene.</p>
            <p>Loopwears will take a percentage of each successful rental transaction as a service fee.</p>
            <p>In case of disputes, Loopwears will mediate based on submitted evidence from both parties.</p>
            <p>Loopwears is not responsible for loss or damages but will facilitate fair resolutions between users.</p>
            <p>
              If a lender receives 3 verified complaints from renters (regarding item condition, late delivery, or
              misrepresentation), their account may be suspended or permanently removed by Loopwear admin.
            </p>
            <p>
              Lenders with consistent positive reviews and zero complaints over six months receive reduced platform
              fees or promotional boosts for their listings.
            </p>
            <p>
              If renters fail to return items on time, lenders are eligible for late return fees or extended rental
              payments until the item is returned.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
export default function LoopWearBanner() {
    return (
      <div className="flex flex-col w-full  mx-auto overflow-hidden rounded-lg">
        {/* Main content area */}
        <div className="py-16 px-8 bg-[#F1E4D1] text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-black">Got Plans? Just #LoopItOn</h1>
          <p className="text-xl md:text-2xl text-[#6E391D] max-w-2xl mx-auto">
            Don't buy something you'll only wear only once or twice - Rent dresses at a fraction of the price!
          </p>
        </div>
  
        {/* Footer */}
        <div className="py-4 px-8 bg-[#6E391D] text-center">
          <a
            href="https://www.loopwear.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-normal text-2xl font-['Kufam',sans-serif]"
          >
            www.loopwear.com
          </a>
        </div>
      </div>
    )
  }
  
  
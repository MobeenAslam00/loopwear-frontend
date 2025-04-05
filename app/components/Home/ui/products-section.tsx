import Image from "next/image"
import Link from "next/link"

export default function ProductsSection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-[#F6E7DB]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl md:text-5xl text-[#462920] font-serif mb-16">Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Non Bridals */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl text-center font-serif">Non Bridals</h3>
            <Link href="/products/Non-Bridal" className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src="https://res.cloudinary.com/dklqbx5k0/image/upload/v1741306780/qft3nhk6lrgn6gtyziwr.png"
                  alt="Non Bridal Dress - Black traditional dress with embellishments"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Bridals */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl text-center font-serif">Bridals</h3>
            <Link href="/products/Bridal" className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src="https://res.cloudinary.com/dklqbx5k0/image/upload/v1741306785/xygpk7fimeoqlx0xv2si.png"
                  alt="Bridal Dress - Light blue embroidered gown"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Party Wear */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl text-center font-serif">Party Wear</h3>
            <Link href="/products/Party-Wear" className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src="https://shoprex.com/images/srproducts/large/heavy-embroidered-grey-net-formal-wedding-dress_44534.jpg"
                  alt="Party Wear - Elegant evening dress"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

import { ClothingCard } from "@/app/components/global/clothing-card"
import FooterBanner from "@/app/components/global/footer-banner"
import TopBanner from "@/app/components/global/top-banner"


export default function Home() {
  const products = [
    {
      id: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1548365328-9f982c417ef3?auto=format&fit=crop&w=800&q=80",
      title: "Festive Orange Suit",
      price: 5000,
      action: "Lend" as const,
    },
    {
      id: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1591025183703-3e4b48b70127?auto=format&fit=crop&w=800&q=80",
      title: "Casual Summer Dress",
      price: 3200,
      action: "Rent" as const,
    },
    {
      id: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1563805042-7684cb590f64?auto=format&fit=crop&w=800&q=80",
      title: "Elegant Embroidered Kurta",
      price: 4500,
      action: "Lend" as const,
    },
    {
      id: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1585166555401-bbe06fc139be?auto=format&fit=crop&w=800&q=80",
      title: "Party Wear Gown",
      price: 12000,
      action: "Rent" as const,
    },
    {
      id: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1551861568-5d0e5e6f2d10?auto=format&fit=crop&w=800&q=80",
      title: "Lightweight Floral Dress",
      price: 2800,
      action: "Lend" as const,
    },
    {
      id: 6,
      imageUrl:
        "https://images.unsplash.com/photo-1614521543342-eca22bbaf7f1?auto=format&fit=crop&w=800&q=80",
      title: "Formal Evening Gown",
      price: 18000,
      action: "Rent" as const,
    },
    {
      id: 7,
      imageUrl:
        "https://images.unsplash.com/photo-1589923188900-19257fdd9b24?auto=format&fit=crop&w=800&q=80",
      title: "Classic Saree",
      price: 8000,
      action: "Lend" as const,
    },
    {
      id: 8,
      imageUrl:
        "https://images.unsplash.com/photo-1545231098-c4a532dcae19?auto=format&fit=crop&w=800&q=80",
      title: "Printed Lawn Suit",
      price: 3500,
      action: "Rent" as const,
    },
    {
      id: 9,
      imageUrl:
        "https://images.unsplash.com/photo-1563908368-aeddbf669d4f?auto=format&fit=crop&w=800&q=80",
      title: "Casual Kurti",
      price: 2200,
      action: "Lend" as const,
    },
    {
      id: 10,
      imageUrl:
        "https://images.unsplash.com/photo-1618354695660-b6b8b3c0a67f?auto=format&fit=crop&w=800&q=80",
      title: "Heavily Embroidered Dress",
      price: 15000,
      action: "Rent" as const,
    },
  ]

  return (
    <main className="mx-auto h-screen">
      <TopBanner back={true} />
      <div className="bg-[#FAF4EF] p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ClothingCard
              key={product.id}
              imageUrl={product.imageUrl}
              title={product.productName}
              price={product.price}
              action={product.action}
            />
          ))}
        </div>
      </div>
      <FooterBanner />
    </main>
  )
}

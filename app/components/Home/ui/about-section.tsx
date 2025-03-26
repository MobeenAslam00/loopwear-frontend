import Image from "next/image"

export default function AboutSection() {
  const impacts = [
    {
      title: "Industrial Consumption",
      image: "https://res.cloudinary.com/dklqbx5k0/image/upload/v1741309771/rxowhkhbwicb4mapt2rr.png",
      description:
        "High demand for natural resources (water, energy, raw materials). Drives mass production but leads to resource depletion.",
    },
    {
      title: "Landfills waste",
      image: "https://res.cloudinary.com/dklqbx5k0/image/upload/v1741309766/syzow3kyjdqrdkw93ah3.png",
      description:
        "Contributes significantly to solid waste buildup. Large amounts of non-biodegradable materials disposed of yearly.Landfills cause soil contamination and release harmful methane gases.",
    },
    {
      title: "Chemical Waste",
      image: "https://res.cloudinary.com/dklqbx5k0/image/upload/v1741309763/mfw5mqjgcmozspyerjpb.png",
      description:
        "Includes toxic byproducts from manufacturing and processing. Leads to water and air pollution, harming ecosystems. Improper disposal results in long-term environmental damage.",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8" style={{ backgroundColor: "rgba(110, 57, 29, 0.51)" }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl md:text-5xl text-[#462920] font-serif mb-16">About LoopWear</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {impacts.map((impact, index) => (
            <div key={index} className="flex flex-col items-center">
              <h3 className="text-xl md:text-2xl font-serif mb-6 text-[#462920]">{impact.title}</h3>

              <div className="relative w-full aspect-[4/3] mb-6">
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={impact.image || "/placeholder.svg"}
                    alt={impact.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>

              <p className="text-center font-serif text-[#FFFFFF] leading-relaxed">{impact.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


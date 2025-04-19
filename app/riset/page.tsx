import Image from "next/image"
import Link from "next/link"

export default function RisetPage() {
  const researchProjects = [
    {
      title: "Low Cost Weather Station",
      description: "Penelitian mengenai stasiun pengamatan cuaca yang akurat namun mudah dibuat",
      image: "/img/riset/re.jpg",
      link: "#",
    },
    {
      title: "Battery and Energy Consumption Optimization",
      description: "Penelitian untuk meningkatkan efisiensi penggunaan energi listrik",
      image: "/img/riset/re.jpg",
      link: "#",
    },
    {
      title: "Analytic and Visualization Method",
      description: "Pengkajian analisis dan visualisasi data cuaca",
      image: "/img/riset/re.jpg",
      link: "#",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Riset Kami</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchProjects.map((project, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="relative h-48">
              <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h5 className="text-xl font-semibold mb-2">{project.title}</h5>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <Link
                href={project.link}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                Baca Selengkapnya
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

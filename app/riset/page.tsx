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
    <div className="bg-gray-100 dark:bg-gray-900 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Riset Kami</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchProjects.map((project, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full"
          >
            <div className="relative h-48">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h5 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {project.title}
              </h5>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
              <Link
                href={project.link}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded dark:bg-blue-500 dark:hover:bg-blue-600"
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

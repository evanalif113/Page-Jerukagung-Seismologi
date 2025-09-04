import Image from "next/image"
import { Github, Linkedin } from "lucide-react"
import Header from "@/components/header"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TimKamiPage() {
  const teamMembers = [
    {
      name: "Evan Alif Widhyatma",
      role: "Project Manager, Research Assist, Frontend Developer",
      image: "https://media.licdn.com/dms/image/v2/D5603AQFVFvglk8kC3w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1727273555054?e=1759363200&v=beta&t=asdFwG7CHmSbOz2mSGlkmuoGuH9hAqRqYOcrO-nPFjk",
      github: "https://github.com/evanalif113",
      linkedin: "https://www.linkedin.com/in/evan-alif-widhyatma-5b3a5a1b3/",
    },
    {
      name: "Muhammad Rizal Arfiyan",
      role: "Fullstack Developer",
      image: "https://media.licdn.com/dms/image/v2/C5603AQE_j87VeQpSCg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1627974909878?e=1759363200&v=beta&t=Ea22dBD3GxYzFClSZ8MGGXBEUl6JRMqoCXzD8GuDnhg",
      github: "https://github.com/rizalarfiyan",
      linkedin: "https://www.linkedin.com/in/rizalarfiyan/",
    },
    {
      name: "Bagus Alfian Yusuf",
      role: "Mobile developer, Fullstack Developer, DevOps",
      image: "https://media.licdn.com/dms/image/v2/D5603AQG19RCrdc0cfg/profile-displayphoto-shrink_800_800/B56ZTQlMUtGsAg-/0/1738666198992?e=1759363200&v=beta&t=x9L-l3CbK1RmfYO1XCDrBAILwxqWiIwiM3QNKbz_NEg",
      github: "https://github.com/Fiyanz",
      linkedin: "https://www.linkedin.com/in/fiyanz/",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Tim Riset</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96 w-full">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <div className="p-6 text-center">
                <h5 className="text-xl font-semibold mb-1">{member.name}</h5>
                <p className="mb-4 text-gray-600 dark:text-gray-300">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <Github className="h-4 w-4" /> Github
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-transparent text-white bg-blue-600 rounded-md px-4 py-2 hover:bg-blue-700"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

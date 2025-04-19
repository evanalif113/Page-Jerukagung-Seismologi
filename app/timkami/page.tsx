import Image from "next/image"
import { Github } from "lucide-react"

export default function TimKamiPage() {
  const teamMembers = [
    {
      name: "Evan Alif Widhyatma",
      role: "Lead Researcher",
      skills: "Bahasa: C++",
      image: "https://avatars.githubusercontent.com/u/56740250?v=4",
      github: "https://github.com/evanalif113",
    },
    {
      name: "Muhammad Rizal Arfiyan",
      role: "Backend Developer",
      skills: "Bahasa: Golang",
      image: "https://avatars.githubusercontent.com/u/19503666?v=4",
      github: "https://github.com/rizalarfiyan",
    },
    {
      name: "Bagus Alfian Yusuf",
      role: "Software Developer",
      skills: "Bahasa: PHP",
      image: "https://avatars.githubusercontent.com/u/59005468?v=4",
      github: "https://github.com/Fiyanz",
    },
    {
      name: "Anon1",
      role: "Firmware Enginer",
      skills: "Etiam sit amet orci eget eros faucibus tincidunt.",
      image: "/img/userprofile/anon.jpg",
      github: "#",
    },
    {
      name: "Anon2",
      role: "Hardware Enginer",
      skills: "Etiam sit amet orci eget eros faucibus tincidunt.",
      image: "/img/userprofile/anon.jpg",
      github: "#",
    },
    {
      name: "Anon3",
      role: "UI/UX Researcher",
      skills: "Etiam sit amet orci eget eros faucibus tincidunt.",
      image: "/img/userprofile/anon.jpg",
      github: "#",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Tim Riset</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64">
              <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
            </div>
            <div className="p-6 text-center">
              <h5 className="text-xl font-semibold mb-1">{member.name}</h5>
              <p className="mb-1">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member.skills}</p>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100"
              >
                <Github className="h-4 w-4" /> Github
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Card, CardContent } from "../../../../components/ui/card"
import { Code2, Database, Server, GitBranch, Cpu } from "lucide-react"

type AboutBioTabProps = {
  bio: string
  focus: string
}

const stackIcons = [
  { name: "TypeScript", icon: Code2 },
  { name: "Java", icon: Cpu },
  { name: "Spring Boot", icon: Server },
  { name: "Node.js", icon: Server },
  { name: "DevOps", icon: GitBranch },
  { name: "Databases", icon: Database },
]

/**
 * Presentational component for About Bio tab
 */
export function AboutBioTab({ bio, focus }: AboutBioTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <p className="text-lg mb-6 leading-relaxed">{bio}</p>
        <p className="text-lg mb-6 leading-relaxed">{focus}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stackIcons.map((item) => (
          <Card key={item.name} className="border border-border hover:border-primary/50 transition-colors">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <item.icon className="h-10 w-10 mb-3 text-primary" />
              <span className="text-sm font-medium">{item.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

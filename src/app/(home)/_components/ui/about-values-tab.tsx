import { Card, CardContent } from "../../../../components/ui/card"
import { Heart, Target, Lightbulb, Star, Zap, Award, Compass, Shield, type LucideIcon } from "lucide-react"
import type { AboutValue } from "../../../../lib/types"

type AboutValuesTabProps = {
  values: AboutValue[]
  mission: string
  missionTitle: string
}

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Target,
  Lightbulb,
  Star,
  Zap,
  Award,
  Compass,
  Shield,
}

/**
 * Presentational component for About Values tab
 */
export function AboutValuesTab({ values, mission, missionTitle }: AboutValuesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((value) => {
          const IconComponent = iconMap[value.icon] || Heart
          return (
            <Card key={value.id} className="border border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{missionTitle}</h3>
        <p className="text-lg leading-relaxed">{mission}</p>
      </div>
    </div>
  )
}

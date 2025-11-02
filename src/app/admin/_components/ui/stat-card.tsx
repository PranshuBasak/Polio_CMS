import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react"

type StatCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
  change?: string
  changeType?: "increase" | "decrease"
  changeText?: string
}

/**
 * Presentational component for stat card
 * Reusable card for displaying statistics
 */
export function StatCard({ title, value, icon: Icon, change, changeType = "increase", changeText }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/70">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && changeText && (
          <div className="flex items-center text-xs mt-1">
            <span
              className={
                changeType === "increase" ? "text-emerald-500 flex items-center" : "text-rose-500 flex items-center"
              }
            >
              {changeType === "increase" ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {change}
            </span>
            <span className="text-muted-foreground ml-1">{changeText}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

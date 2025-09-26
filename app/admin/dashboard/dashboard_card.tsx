import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string
  icon: ReactNode
  value: number
  showKg?: boolean
}
export default function DashboardCard({ title, icon, value, showKg = true }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {value} {showKg ? "kg": ""}
        </div>
        <p className="text-xs text-muted-foreground">Bulan ini</p>
      </CardContent>
    </Card>
  )
}

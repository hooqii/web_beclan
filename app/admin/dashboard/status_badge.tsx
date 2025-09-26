import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "Selesai" | "Terjadwal"
}
export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Selesai") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="w-3 h-3 mr-1" />
        Selesai
      </Badge>
    );

  }
  if (status === "Terjadwal") {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <Calendar className="w-3 h-3 mr-1" />
        Terjadwal
      </Badge>
    );

  }
  return <Badge variant="secondary">{status}</Badge>;
}

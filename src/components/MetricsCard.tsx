import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

const MetricsCard = ({ icon: Icon, label, value, change, positive }: MetricsCardProps) => {
  return (
    <Card className="metric-card hover:scale-[1.02] transition-all duration-200 cursor-default hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${positive ? 'text-success' : 'text-muted-foreground'}`}>
              {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default MetricsCard;

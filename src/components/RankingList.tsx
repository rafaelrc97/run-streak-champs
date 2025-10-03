import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

const rankings = [
  { position: 1, name: "João Silva", distance: "156.8 km", icon: Trophy, color: "text-yellow-500" },
  { position: 2, name: "Maria Santos", distance: "142.3 km", icon: Medal, color: "text-gray-400" },
  { position: 3, name: "Você", distance: "128.5 km", icon: Award, color: "text-orange-500" },
  { position: 4, name: "Pedro Costa", distance: "115.2 km" },
  { position: 5, name: "Ana Lima", distance: "98.7 km" },
];

const RankingList = () => {
  return (
    <Card className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Ranking Semanal</h3>
      {rankings.map((rank) => {
        const Icon = rank.icon;
        return (
          <div
            key={rank.position}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
              rank.position === 3 
                ? 'bg-primary/10 border border-primary/30' 
                : 'bg-muted/20 hover:bg-muted/30'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold">
              {rank.position}
            </div>
            {Icon && <Icon className={`w-5 h-5 ${rank.color}`} />}
            <div className="flex-1">
              <p className="font-semibold">{rank.name}</p>
              <p className="text-sm text-muted-foreground">{rank.distance}</p>
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default RankingList;

import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { getWeeklyRanking, getCurrentUser } from "@/lib/storage";
import { useEffect, useState } from "react";

const RankingList = () => {
  const [rankings, setRankings] = useState<Array<{ username: string; name: string; distance: number; position: number }>>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const ranking = getWeeklyRanking();
    const rankedData = ranking.map((r, index) => ({
      ...r,
      position: index + 1
    }));
    setRankings(rankedData);
  }, []);

  if (rankings.length === 0) {
    return (
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Ranking Semanal</h3>
        <p className="text-center text-muted-foreground py-8">
          Nenhum usuário com atividades esta semana.
          <br />
          Seja o primeiro a correr!
        </p>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">Ranking Semanal</h3>
      {rankings.map((rank) => {
        const isCurrentUser = rank.username === currentUser?.username;
        let Icon = undefined;
        let color = "";
        
        if (rank.position === 1) {
          Icon = Trophy;
          color = "text-yellow-500";
        } else if (rank.position === 2) {
          Icon = Medal;
          color = "text-gray-400";
        } else if (rank.position === 3) {
          Icon = Award;
          color = "text-orange-500";
        }
        
        return (
          <div
            key={rank.username}
            className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
              isCurrentUser
                ? 'bg-primary/10 border border-primary/30' 
                : 'bg-muted/20 hover:bg-muted/30'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold">
              {rank.position}
            </div>
            {Icon && <Icon className={`w-5 h-5 ${color}`} />}
            <div className="flex-1">
              <p className="font-semibold">
                {isCurrentUser ? 'Você' : rank.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {rank.distance.toFixed(1)} km
              </p>
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default RankingList;

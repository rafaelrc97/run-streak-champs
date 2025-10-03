import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { getActivities, getCurrentUser } from "@/lib/storage";
import { useEffect, useState } from "react";
import { Activity } from "@/types/activity";

const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Get all activities and sort by date (most recent first)
    const allActivities = getActivities()
      .filter(a => currentUser?.friends.includes(a.username) || a.username === currentUser?.username)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10); // Show last 10 activities
    
    setActivities(allActivities);
  }, [currentUser]);

  if (activities.length === 0) {
    return (
      <Card className="glass-card p-6">
        <p className="text-center text-muted-foreground py-8">
          Nenhuma atividade recente.
          <br />
          Adicione amigos ou comece a treinar!
        </p>
      </Card>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getActivityEmoji = (type: string) => {
    switch (type) {
      case 'corrida': return '🏃';
      case 'ciclismo': return '🚴';
      case 'caminhada': return '🚶';
      case 'treino-tiro': return '🏃‍♂️💨';
      default: return '🏃';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="glass-card p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl">
                {getActivityEmoji(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {activity.username === currentUser?.username ? 'Você' : activity.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  completou uma {activity.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Distância</span>
                <span className="font-semibold">{activity.distance.toFixed(2)} km</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tempo</span>
                <span className="font-semibold">{formatTime(activity.duration)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ritmo</span>
                <span className="font-semibold text-primary">{activity.pace} /km</span>
              </div>
              {activity.type === 'treino-tiro' && activity.splits && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tiros</span>
                  <span className="font-semibold">{activity.splits.length} sprints</span>
                </div>
              )}
            </div>

            {activity.photo && (
              <img src={activity.photo} alt="Activity" className="rounded-lg w-full" />
            )}

            <div className="flex items-center gap-4 pt-2 border-t border-border/50">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="w-4 h-4" />
                0
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                0
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityFeed;

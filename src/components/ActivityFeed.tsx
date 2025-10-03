import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

const activities = [
  {
    user: "Maria Santos",
    activity: "completou uma corrida",
    distance: "10.5 km",
    time: "52:30",
    pace: "5:00/km",
    likes: 24,
    comments: 3,
  },
  {
    user: "João Silva",
    activity: "bateu seu recorde pessoal",
    distance: "21.1 km",
    time: "1:45:20",
    pace: "4:58/km",
    likes: 42,
    comments: 8,
  },
];

const ActivityFeed = () => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <Card key={index} className="glass-card p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                {activity.user[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{activity.user}</p>
                <p className="text-sm text-muted-foreground">{activity.activity}</p>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Distância</span>
                <span className="font-semibold">{activity.distance}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tempo</span>
                <span className="font-semibold">{activity.time}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ritmo</span>
                <span className="font-semibold text-primary">{activity.pace}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-border/50">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="w-4 h-4" />
                {activity.likes}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                {activity.comments}
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

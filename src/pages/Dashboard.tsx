import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Trophy, Target, TrendingUp, LogOut, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsCard from "@/components/MetricsCard";
import RankingList from "@/components/RankingList";
import ActivityFeed from "@/components/ActivityFeed";
import InstallPWA from "@/components/InstallPWA";
import AddFriend from "@/components/AddFriend";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, saveUser, calculateWeeklyStats, getWeeklyRanking, getUserActivities } from "@/lib/storage";
import { User } from "@/types/activity";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/auth");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Até logo!",
      description: "Você foi desconectado.",
    });
    navigate("/auth");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, photo: reader.result as string };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast({
          title: "Foto atualizada!",
          description: "Sua foto de perfil foi alterada.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  const weeklyStats = calculateWeeklyStats(user.username);
  const ranking = getWeeklyRanking();
  const userPosition = ranking.findIndex(r => r.username === user.username) + 1;
  const userActivities = getUserActivities(user.username);

  return (
    <div className="min-h-screen bg-background">
      <InstallPWA />
      {/* Header */}
      <header className="glass-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SpeedRun</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo, {user.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AddFriend />
            <div className="relative">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary/50 hover:border-primary transition-colors">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-5 h-5 text-primary" />
                  )}
                </div>
              </label>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricsCard
            icon={Activity}
            label="Esta Semana"
            value={`${weeklyStats.distance.toFixed(1)} km`}
          />
          <MetricsCard
            icon={Trophy}
            label="Posição"
            value={userPosition > 0 ? `#${userPosition}` : "-"}
          />
          <MetricsCard
            icon={Target}
            label="Atividades"
            value={`${userActivities.length}`}
          />
          <MetricsCard
            icon={TrendingUp}
            label="Ritmo Médio"
            value={weeklyStats.avgPace}
          />
        </div>

        {/* Start Activity Button */}
        <Button 
          className="w-full py-8 text-lg"
          variant="gradient"
          onClick={() => navigate("/activity")}
        >
          <Activity className="w-6 h-6 mr-2" />
          Iniciar Atividade
        </Button>

        {/* Tabs */}
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="mt-6">
            {userActivities.length === 0 ? (
              <Card className="glass-card p-8 text-center">
                <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma atividade ainda</h3>
                <p className="text-muted-foreground">
                  Comece sua primeira corrida agora!
                </p>
              </Card>
            ) : (
              <Card className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">Minhas Atividades</h3>
                <div className="space-y-4">
                  {userActivities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div>
                        <p className="font-semibold capitalize">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString('pt-BR')} • {activity.distance.toFixed(2)} km
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{activity.pace} /km</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ranking" className="mt-6">
            <RankingList />
          </TabsContent>

          <TabsContent value="feed" className="mt-6">
            <ActivityFeed />
          </TabsContent>
        </Tabs>

        {/* Tournaments */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/tournaments")}
        >
          <Trophy className="w-5 h-5 mr-2" />
          Ver Torneios Mensais
        </Button>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 SpeedRun. Todos os direitos reservados a Rafael Carlos de Assis Santos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

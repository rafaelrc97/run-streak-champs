import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Home } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activityType, time, distance, pace, speed } = location.state || {};
  const [feeling, setFeeling] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast({
      title: "Atividade salva!",
      description: "Sua corrida foi registrada com sucesso.",
    });
    navigate("/dashboard");
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Resumo da Atividade</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Card className="glass-card p-6">
          <h2 className="text-2xl font-bold gradient-text mb-4">
            {activityType === "corrida" ? "🏃" : activityType === "ciclismo" ? "🚴" : "🚶"} {activityType?.charAt(0).toUpperCase() + activityType?.slice(1)} Concluída!
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Tempo Total</p>
              <p className="text-2xl font-bold">{formatTime(time)}</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Distância</p>
              <p className="text-2xl font-bold">{distance?.toFixed(2)} km</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Ritmo Médio</p>
              <p className="text-2xl font-bold text-primary">{pace} /km</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Velocidade Média</p>
              <p className="text-2xl font-bold">{speed} km/h</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 space-y-4">
          <div>
            <Label>Como você se sentiu?</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {["😫", "😔", "😐", "😊", "🤩"].map((emoji, index) => (
                <Button
                  key={index}
                  variant={feeling === emoji ? "default" : "outline"}
                  onClick={() => setFeeling(emoji)}
                  className="text-2xl h-12"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas da corrida</Label>
            <Textarea
              id="notes"
              placeholder="Como foi o treino? Alguma observação?"
              className="mt-2 bg-muted/50"
            />
          </div>

          <div>
            <Label>Foto da conquista</Label>
            <div className="mt-2">
              <input
                type="file"
                id="activity-photo"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label htmlFor="activity-photo">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  {photo ? (
                    <img src={photo} alt="Activity" className="max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <>
                      <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Clique para adicionar uma foto</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1 py-6 text-lg" variant="gradient">
            Salvar Atividade
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline" size="icon" className="h-auto aspect-square">
            <Home className="w-6 h-6" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Summary;

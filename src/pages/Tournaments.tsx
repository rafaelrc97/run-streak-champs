import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, ArrowLeft, DollarSign, Users, Calendar, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Tournaments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pixKey, setPixKey] = useState("");

  const handlePixConfig = () => {
    if (!pixKey) {
      toast({
        title: "Erro",
        description: "Digite sua chave PIX",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("pix_key", pixKey);
    toast({
      title: "Chave PIX salva!",
      description: "Você pode receber premiações agora.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Torneios Mensais</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* PIX Configuration */}
        <Card className="glass-card p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Configure sua Chave PIX</h2>
                <p className="text-sm text-muted-foreground">
                  Para receber prêmios dos torneios
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pix-key">Chave PIX (CPF, Email, Telefone ou Chave Aleatória)</Label>
              <Input
                id="pix-key"
                type="text"
                placeholder="Digite sua chave PIX"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>
            <Button onClick={handlePixConfig} variant="gradient" className="w-full">
              Salvar Chave PIX
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="glass-card p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-bold mb-3">Como Funcionam os Torneios</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              <p>Torneios ocorrem mensalmente com diferentes modalidades</p>
            </div>
            <div className="flex gap-3">
              <Users className="w-5 h-5 text-primary flex-shrink-0" />
              <p>Compita com corredores de todo o Brasil</p>
            </div>
            <div className="flex gap-3">
              <Award className="w-5 h-5 text-primary flex-shrink-0" />
              <p>Top 3 recebem prêmios via PIX automaticamente</p>
            </div>
            <div className="flex gap-3">
              <Trophy className="w-5 h-5 text-primary flex-shrink-0" />
              <p>Taxa de inscrição: R$ 10,00 por torneio</p>
            </div>
          </div>
        </Card>

        {/* Coming Soon Message */}
        <Card className="glass-card p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">Em Breve!</h3>
          <p className="text-muted-foreground mb-4">
            Os torneios mensais estarão disponíveis em breve.
            <br />
            Continue treinando e acompanhe as novidades!
          </p>
          <p className="text-sm text-muted-foreground">
            Quando os torneios forem lançados, você receberá uma notificação.
          </p>
        </Card>
      </main>

      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 SpeedRun. Todos os direitos reservados a Rafael Carlos de Assis Santos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Tournaments;

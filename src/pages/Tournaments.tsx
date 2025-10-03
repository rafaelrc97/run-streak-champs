import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Users, Calendar, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const tournaments = [
  {
    id: 1,
    title: "Desafio 100km Março",
    prize: "R$ 500",
    entry: "R$ 20",
    participants: 45,
    deadline: "31/03/2025",
    status: "open",
  },
  {
    id: 2,
    title: "Sprint 5km - Melhor Tempo",
    prize: "R$ 300",
    entry: "R$ 15",
    participants: 28,
    deadline: "15/03/2025",
    status: "open",
  },
  {
    id: 3,
    title: "Maratona Virtual 42km",
    prize: "R$ 1.000",
    entry: "R$ 50",
    participants: 67,
    deadline: "30/04/2025",
    status: "open",
  },
];

const Tournaments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pixKey, setPixKey] = useState("");

  const handleEnter = (tournamentTitle: string, entry: string) => {
    if (!pixKey) {
      toast({
        title: "PIX não configurado",
        description: "Configure sua chave PIX antes de entrar em torneios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Inscrição realizada!",
      description: `Você entrou no torneio "${tournamentTitle}". Valor: ${entry}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Torneios</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Card className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Configuração de Pagamento</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pix">Chave PIX para recebimento de prêmios</Label>
              <Input
                id="pix"
                placeholder="Sua chave PIX (email, telefone ou CPF)"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="mt-2 bg-muted/50"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Esta chave será usada para receber seus prêmios. Os pagamentos das inscrições também serão processados via PIX.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold gradient-text">Torneios Ativos</h2>
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="glass-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{tournament.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {tournament.participants} participantes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      até {tournament.deadline}
                    </span>
                  </div>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-sm text-muted-foreground">Prêmio</p>
                  <p className="text-2xl font-bold text-primary">{tournament.prize}</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Inscrição</p>
                  <p className="text-2xl font-bold">{tournament.entry}</p>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="gradient">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Entrar no Torneio
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card">
                  <DialogHeader>
                    <DialogTitle>Confirmar Inscrição</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p>Torneio: <strong>{tournament.title}</strong></p>
                    <p>Valor da inscrição: <strong>{tournament.entry}</strong></p>
                    <p className="text-sm text-muted-foreground">
                      O pagamento será processado via PIX. Após a confirmação, você receberá um QR Code para pagamento.
                    </p>
                    <Button
                      onClick={() => handleEnter(tournament.title, tournament.entry)}
                      className="w-full"
                      variant="gradient"
                    >
                      Confirmar e Gerar PIX
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 RunFlow. Todos os direitos reservados a Rafael Carlos de Assis Santos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Tournaments;

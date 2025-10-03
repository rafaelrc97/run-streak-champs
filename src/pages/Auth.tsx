import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveUser, getAllUsers } from "@/lib/storage";
import { User } from "@/types/activity";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    // Simple auth simulation - find user by email
    const users = getAllUsers();
    const user = users.find(u => u.email === loginEmail);
    
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Bem-vindo de volta!",
        description: `Olá, ${user.name}!`,
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Erro",
        description: "Usuário não encontrado. Crie uma conta primeiro.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerName || !registerUsername || !registerEmail || !registerPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (!validateUsername(registerUsername)) {
      toast({
        title: "Username inválido",
        description: "Use apenas letras, números e underscore (3-20 caracteres)",
        variant: "destructive",
      });
      return;
    }

    // Check if username already exists
    const users = getAllUsers();
    if (users.some(u => u.username === registerUsername)) {
      toast({
        title: "Erro",
        description: "Username já está em uso. Escolha outro.",
        variant: "destructive",
      });
      return;
    }

    if (users.some(u => u.email === registerEmail)) {
      toast({
        title: "Erro",
        description: "Email já cadastrado. Faça login.",
        variant: "destructive",
      });
      return;
    }

    const newUser: User = {
      name: registerName,
      username: registerUsername,
      email: registerEmail,
      photo: null,
      friends: [],
    };

    saveUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    toast({
      title: "Conta criada!",
      description: `Bem-vindo, @${registerUsername}!`,
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      
      <div className="z-10 w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-elegant animate-scale-in">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">SpeedRun</h1>
          <p className="text-muted-foreground">Corra. Compete. Conquiste.</p>
        </div>

        <Card className="glass-card p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" variant="gradient">
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Nome Completo</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="João Silva"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="joaosilva"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value.toLowerCase())}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    3-20 caracteres, apenas letras, números e underscore
                  </p>
                </div>
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" variant="gradient">
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

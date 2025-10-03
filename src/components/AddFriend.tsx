import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, saveUser, findUserByUsername } from "@/lib/storage";

const AddFriend = () => {
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAddFriend = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const searchUsername = username.toLowerCase().replace('@', '');
    
    if (searchUsername === currentUser.username) {
      toast({
        title: "Erro",
        description: "Você não pode adicionar a si mesmo",
        variant: "destructive",
      });
      return;
    }

    const friendUser = findUserByUsername(searchUsername);
    
    if (!friendUser) {
      toast({
        title: "Usuário não encontrado",
        description: `@${searchUsername} não existe`,
        variant: "destructive",
      });
      return;
    }

    if (currentUser.friends.includes(searchUsername)) {
      toast({
        title: "Já é amigo",
        description: `Você já adicionou @${searchUsername}`,
      });
      return;
    }

    currentUser.friends.push(searchUsername);
    saveUser(currentUser);

    toast({
      title: "Amigo adicionado!",
      description: `@${searchUsername} foi adicionado aos seus amigos`,
    });

    setUsername("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <UserPlus className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card">
        <DialogHeader>
          <DialogTitle>Adicionar Amigo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={handleAddFriend} className="w-full" variant="gradient">
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriend;

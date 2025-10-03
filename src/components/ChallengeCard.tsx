import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ChallengeCardProps {
  title: string;
  description: string;
  progress: number;
  reward: string;
}

const ChallengeCard = ({ title, description, progress, reward }: ChallengeCardProps) => {
  return (
    <Card className="glass-card p-5 hover:scale-[1.02] transition-transform">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{progress}% completo</span>
          <span className="font-medium">{reward}</span>
        </div>
      </div>
    </Card>
  );
};

export default ChallengeCard;

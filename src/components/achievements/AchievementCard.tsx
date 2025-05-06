
import { Achievement } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const { name, description, icon, unlocked, progress, maxProgress, level } = achievement;
  
  // Map numeric level to string for CSS classes
  const getLevelClass = (level: 1 | 2 | 3) => {
    switch (level) {
      case 1: return 'bronze';
      case 2: return 'silver';
      case 3: return 'gold';
      default: return 'bronze';
    }
  };
  
  return (
    <Card 
      className={cn(
        "transition-all duration-300 mb-4",
        unlocked ? "border-2 border-accent" : "opacity-70"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div 
            className={cn(
              "achievement h-12 w-12 flex-shrink-0",
              unlocked ? `achievement-${getLevelClass(level)}` : "achievement-locked"
            )}
          >
            <span className="text-2xl">{icon}</span>
          </div>
          
          <div className="flex-1">
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
            
            {maxProgress && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progression</span>
                  <span>{progress || 0}/{maxProgress}</span>
                </div>
                <Progress 
                  value={(progress || 0) / maxProgress * 100} 
                  className={cn(
                    "h-1.5",
                    unlocked ? "bg-accent/20" : "bg-muted"
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;

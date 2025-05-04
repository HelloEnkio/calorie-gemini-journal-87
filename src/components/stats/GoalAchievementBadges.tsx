
import { Badge } from "@/components/ui/badge";
import { DailyLog } from "@/types";
import { calculateGoalAchievements } from "@/utils/statsCalculations";

interface GoalAchievementBadgesProps {
  logs: DailyLog[];
}

const GoalAchievementBadges = ({ logs }: GoalAchievementBadgesProps) => {
  const achievements = calculateGoalAchievements(logs);

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t">
      <h3 className="text-sm font-medium mb-3">Objectifs atteints (±10%)</h3>
      <div className="flex flex-wrap gap-2">
        <Badge className={`${achievements.calories >= 50 ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-muted'}`}>
          <span className="mr-1">Calories</span>
          <span className="font-bold">{achievements.calories}%</span>
          {achievements.calories >= 50 && <span className="ml-1">🎯</span>}
        </Badge>
        
        <Badge className={`${achievements.protein >= 50 ? 'bg-teal-100 text-teal-800 hover:bg-teal-200' : 'bg-muted'}`}>
          <span className="mr-1">Protéines</span>
          <span className="font-bold">{achievements.protein}%</span>
          {achievements.protein >= 50 && <span className="ml-1">💪</span>}
        </Badge>
        
        <Badge className={`${achievements.carbs >= 50 ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-muted'}`}>
          <span className="mr-1">Glucides</span>
          <span className="font-bold">{achievements.carbs}%</span>
          {achievements.carbs >= 50 && <span className="ml-1">✨</span>}
        </Badge>
        
        <Badge className={`${achievements.fat >= 50 ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-muted'}`}>
          <span className="mr-1">Lipides</span>
          <span className="font-bold">{achievements.fat}%</span>
          {achievements.fat >= 50 && <span className="ml-1">🌟</span>}
        </Badge>
      </div>
    </div>
  );
};

export default GoalAchievementBadges;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyLog } from "@/types";
import StatsSummary from "@/components/stats/StatsSummary";
import GoalAchievementBadges from "@/components/stats/GoalAchievementBadges";
import { calculateWeightChange } from "@/utils/statsCalculations";

interface SummaryCardProps {
  logs: DailyLog[];
}

const SummaryCard = ({ logs }: SummaryCardProps) => {
  const weightChange = calculateWeightChange(logs);
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Résumé</CardTitle>
      </CardHeader>
      <CardContent>
        <StatsSummary logs={logs} weightChange={weightChange} />
        
        {/* Badges d'atteinte d'objectifs */}
        <GoalAchievementBadges logs={logs} />
      </CardContent>
    </Card>
  );
};

export default SummaryCard;

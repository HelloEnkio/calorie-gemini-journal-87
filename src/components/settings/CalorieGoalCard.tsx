
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CalorieGoalCardProps {
  dailyCalories: string;
  onCaloriesChange: (value: string) => void;
}

const CalorieGoalCard = ({ dailyCalories, onCaloriesChange }: CalorieGoalCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Objectifs caloriques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="daily-calories">Calories quotidiennes</Label>
            <Input
              id="daily-calories"
              type="number"
              value={dailyCalories}
              onChange={(e) => onCaloriesChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieGoalCard;

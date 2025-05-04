
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface MacrosDistributionCardProps {
  dailyCalories: string;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  onProteinChange: (value: number[]) => void;
  onCarbsChange: (value: number[]) => void;
  onFatChange: (value: number[]) => void;
}

const MacrosDistributionCard = ({
  proteinPercentage,
  carbsPercentage,
  fatPercentage,
  proteinGrams,
  carbsGrams,
  fatGrams,
  onProteinChange,
  onCarbsChange,
  onFatChange,
}: MacrosDistributionCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Répartition des macronutriments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Protéines ({proteinPercentage}%)</Label>
              <span className="font-medium">{proteinGrams}g</span>
            </div>
            <Slider
              value={[proteinPercentage]}
              min={10}
              max={50}
              step={1}
              onValueChange={onProteinChange}
              className="bg-teal-100"
            />
            
            <div className="flex justify-between">
              <Label>Glucides ({carbsPercentage}%)</Label>
              <span className="font-medium">{carbsGrams}g</span>
            </div>
            <Slider
              value={[carbsPercentage]}
              min={10}
              max={60}
              step={1}
              onValueChange={onCarbsChange}
              className="bg-amber-100"
            />
            
            <div className="flex justify-between">
              <Label>Lipides ({fatPercentage}%)</Label>
              <span className="font-medium">{fatGrams}g</span>
            </div>
            <Slider
              value={[fatPercentage]}
              min={10}
              max={50}
              step={1}
              onValueChange={onFatChange}
              className="bg-rose-100"
            />
          </div>
          
          <div className="flex h-6 w-full overflow-hidden rounded-full">
            <div 
              className="bg-teal-500" 
              style={{ width: `${proteinPercentage}%` }}
            ></div>
            <div 
              className="bg-amber-500" 
              style={{ width: `${carbsPercentage}%` }}
            ></div>
            <div 
              className="bg-rose-500" 
              style={{ width: `${fatPercentage}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">Distribution calorique recommandée:</p>
            <ul className="list-disc pl-5">
              <li>Protéines: 10-35%</li>
              <li>Glucides: 45-65%</li>
              <li>Lipides: 20-35%</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MacrosDistributionCard;

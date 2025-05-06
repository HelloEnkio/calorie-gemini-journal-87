
interface RecipeNutritionSummaryProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  totalWeight: number;
}

const RecipeNutritionSummary = ({
  calories,
  protein,
  carbs,
  fat,
  totalWeight
}: RecipeNutritionSummaryProps) => {
  return (
    <div className="border p-3 rounded-md">
      <h3 className="font-medium mb-2">Valeurs nutritionnelles calculées</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-sm text-muted-foreground">Calories:</span>
          <span className="font-medium ml-1">{calories} kcal</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Protéines:</span>
          <span className="font-medium ml-1">{protein}g</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Glucides:</span>
          <span className="font-medium ml-1">{carbs}g</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Lipides:</span>
          <span className="font-medium ml-1">{fat}g</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Poids total:</span>
          <span className="font-medium ml-1">
            {totalWeight}g
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeNutritionSummary;

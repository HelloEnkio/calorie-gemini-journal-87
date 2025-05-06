
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MeasureUnit } from "@/types";

interface IngredientItemProps {
  name: string;
  quantity: number;
  unit: MeasureUnit;
  onRemove: () => void;
}

const IngredientItem = ({ name, quantity, unit, onRemove }: IngredientItemProps) => {
  // Helper function to format the unit display
  const formatUnit = (unit: MeasureUnit): string => {
    const measureUnits = [
      { value: MeasureUnit.GRAMS, label: "Grammes (g)" },
      { value: MeasureUnit.MILLILITERS, label: "Millilitres (ml)" },
      { value: MeasureUnit.CUP, label: "Tasse" },
      { value: MeasureUnit.TABLESPOON, label: "Cuillère à soupe" },
      { value: MeasureUnit.TEASPOON, label: "Cuillère à café" },
      { value: MeasureUnit.OUNCE, label: "Once (oz)" },
      { value: MeasureUnit.PIECE, label: "Pièce" }
    ];
    
    const unitItem = measureUnits.find(u => u.value === unit);
    return unitItem ? unitItem.label.split(' ')[0] : unit;
  };

  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div>
        <span className="font-medium">{name}</span>
        <span className="text-sm text-muted-foreground ml-2">
          {quantity} {formatUnit(unit)}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default IngredientItem;

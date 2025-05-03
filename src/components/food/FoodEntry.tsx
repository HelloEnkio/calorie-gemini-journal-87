
import { FoodEntry as FoodEntryType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { removeFoodEntry } from "@/utils/storage";
import { X } from "lucide-react";
import { toast } from "sonner";

interface FoodEntryProps {
  entry: FoodEntryType;
  onDelete?: () => void;
}

const FoodEntry = ({ entry, onDelete }: FoodEntryProps) => {
  const handleDelete = () => {
    removeFoodEntry(entry.id);
    toast.success("Repas supprimé");
    if (onDelete) onDelete();
  };
  
  return (
    <Card className="mb-2 p-3 relative group">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="font-medium">{entry.name}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {entry.calories} kcal
          </div>
        </div>
        <div className="text-right">
          <div className="flex space-x-2 text-sm">
            <div className="bg-teal-100 text-teal-800 px-2 rounded">
              P: {entry.macros.protein}g
            </div>
            <div className="bg-amber-100 text-amber-800 px-2 rounded">
              G: {entry.macros.carbs}g
            </div>
            <div className="bg-rose-100 text-rose-800 px-2 rounded">
              L: {entry.macros.fat}g
            </div>
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
        onClick={handleDelete}
      >
        <X className="h-3 w-3" />
      </Button>
    </Card>
  );
};

export default FoodEntry;

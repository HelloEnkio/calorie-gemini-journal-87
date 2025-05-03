
import { FoodEntry as FoodEntryType } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { removeFoodEntry } from "@/utils/storage";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface FoodEntryProps {
  entry: FoodEntryType;
  onDelete?: () => void;
  hasDetails?: boolean;
  isExpanded?: boolean;
}

const FoodEntry = ({ entry, onDelete, hasDetails = false, isExpanded = false }: FoodEntryProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le dépliant de s'ouvrir lors de la suppression
    removeFoodEntry(entry.id);
    toast.success("Élément supprimé");
    if (onDelete) onDelete();
  };
  
  return (
    <Card className="mb-2 p-3 relative group">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="font-medium flex items-center">
            {entry.name}
            {hasDetails && (
              <span className="ml-2 text-primary">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <span>{entry.calories} kcal</span>
            {entry.weight && <span>• {entry.weight}g</span>}
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

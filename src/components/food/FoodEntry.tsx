
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodEntry as FoodEntryType } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { removeFoodEntry } from "@/utils/storage";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

interface FoodEntryProps {
  entry: FoodEntryType;
  onDelete: () => void;
  hasDetails?: boolean;
  isExpanded?: boolean;
  totalDailyCalories: number;
}

const FoodEntry = ({ entry, onDelete, hasDetails, isExpanded, totalDailyCalories }: FoodEntryProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Calculate percentage of total daily calories
  const percentage = Math.round((entry.calories / totalDailyCalories) * 100) || 0;
  
  const handleDelete = () => {
    // Delete the entry and close the dialog
    const entryDate = new Date(entry.timestamp);
    removeFoodEntry(entryDate, entry.id);
    setShowDeleteDialog(false);
    toast.success("Repas supprimé");
    onDelete();
  };

  const formattedTime = format(new Date(entry.timestamp), "HH:mm", { locale: fr });
  
  return (
    <>
      <Card className="relative overflow-hidden">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <h3 className="font-medium">{entry.name}</h3>
                  {entry.mealType && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 ml-2 rounded">
                      {entry.mealType}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <span className="text-xs flex items-center text-muted-foreground mr-2">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formattedTime}
                  </span>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Trash2 className="h-3.5 w-3.5 text-destructive-foreground/70" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                      </DialogHeader>
                      <p>Êtes-vous sûr de vouloir supprimer "{entry.name}" ?</p>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          Supprimer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="text-xl font-bold">{entry.calories}</span>
                  <span className="text-sm ml-1">kcal</span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {percentage > 0 && `${percentage}% des calories`}
                </div>
              </div>
              
              <div className="flex text-xs text-muted-foreground">
                <span className="mr-3">P: {entry.macros.protein}g</span>
                <span className="mr-3">G: {entry.macros.carbs}g</span>
                <span>L: {entry.macros.fat}g</span>
              </div>
              
              {hasDetails && (
                <div className="mt-2 text-xs text-primary flex items-center">
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5 mr-1" />
                      Masquer les détails
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5 mr-1" />
                      Afficher les détails
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Calories percentage indicator */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 h-1", 
            percentage > 30 ? "bg-amber-500" : "bg-green-500"
          )} 
          style={{ width: `${Math.min(percentage * 3, 100)}%` }}
        />
      </Card>
    </>
  );
};

export default FoodEntry;

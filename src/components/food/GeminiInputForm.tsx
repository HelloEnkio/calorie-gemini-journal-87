
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyzeFoodWithGemini } from "@/services/geminiService";
import { addFoodEntry, generateId } from "@/utils/storage";
import { toast } from "sonner";
import { Loader2, ChevronRight } from "lucide-react";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { useAuth } from "@/contexts/AuthContext";

interface GeminiInputFormProps {
  onAdd?: () => void;
}

const GeminiInputForm = ({ onAdd }: GeminiInputFormProps) => {
  const { protectAction } = useProtectedAction();
  const { isLoggedIn } = useAuth();
  const [foodDescription, setFoodDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyze = async () => {
    if (!foodDescription.trim()) {
      toast.error("Veuillez entrer une description du repas ou de l'aliment");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeFoodWithGemini(foodDescription);
      
      if (result.success && result.calories && result.macros) {
        // Add the analyzed food to the journal
        addFoodEntry({
          id: generateId(),
          name: result.foodName || foodDescription,
          calories: result.calories,
          macros: result.macros,
          timestamp: new Date().toISOString(),
          geminiData: {
            prompt: foodDescription,
            response: result
          }
        });
        
        toast.success("Repas ou aliment ajouté avec succès");
        setFoodDescription("");
        if (onAdd) onAdd();
      } else {
        toast.error(result.errorMessage || "Erreur d'analyse, veuillez réessayer");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite lors de l'analyse");
      console.error("Gemini analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleProtectedAnalyze = () => {
    protectAction(() => handleAnalyze());
  };
  
  return (
    <div className="space-y-3">
      <div className="food-input-highlight rounded-xl p-1">
        <div className="relative rounded-lg bg-white">
          <Input
            placeholder="Décrivez votre repas ou aliment..."
            value={foodDescription}
            onChange={(e) => setFoodDescription(e.target.value)}
            className="pr-24 pl-4 h-12 border-0 shadow-none bg-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleProtectedAnalyze();
              }
            }}
            disabled={isAnalyzing}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              size="sm"
              onClick={handleProtectedAnalyze}
              disabled={isAnalyzing}
              className="rounded-lg bg-primary/90 hover:bg-primary"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Analyse
                </>
              ) : (
                <>
                  Analyser
                  <ChevronRight className="h-3 w-3" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground px-1">
        Décrivez votre repas naturellement, par exemple "Une salade césar avec poulet grillé et croûtons"
      </p>
    </div>
  );
};

export default GeminiInputForm;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analyzeFoodWithGemini } from "@/services/geminiService";
import { addFoodEntry, generateId } from "@/utils/storage";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface GeminiInputFormProps {
  onAdd?: () => void;
}

const GeminiInputForm = ({ onAdd }: GeminiInputFormProps) => {
  const [foodDescription, setFoodDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyze = async () => {
    if (!foodDescription.trim()) {
      toast.error("Veuillez entrer une description du repas");
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
          timestamp: new Date().toISOString()
        });
        
        toast.success("Repas ajouté avec succès");
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
  
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Décrivez votre repas (ex: 100g de poulet et une salade)"
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          className="pr-24"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAnalyze();
            }
          }}
          disabled={isAnalyzing}
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="absolute right-1 top-1 bottom-1"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Analyse
            </>
          ) : (
            "Analyser"
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Décrivez votre repas pour une analyse automatique avec Gemini
      </p>
    </div>
  );
};

export default GeminiInputForm;

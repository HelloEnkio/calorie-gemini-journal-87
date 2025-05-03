
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  analyzeFoodWithGemini, 
  getGeminiApiKey, 
  setGeminiApiKey 
} from "@/services/geminiService";
import { addFoodEntry, generateId } from "@/utils/storage";
import { toast } from "sonner";
import { Loader2, Settings, X, Plus } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

interface GeminiInputFormProps {
  onAdd?: () => void;
}

const GeminiInputForm = ({ onAdd }: GeminiInputFormProps) => {
  const [foodDescription, setFoodDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [foodWeight, setFoodWeight] = useState("");
  
  const isDemo = apiKey === "DEMO_KEY";
  
  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      toast.error("Veuillez entrer une clé API valide");
      return;
    }
    
    setGeminiApiKey(apiKeyInput);
    setApiKey(apiKeyInput);
    toast.success("Clé API Gemini enregistrée");
  };
  
  const handleAnalyze = async () => {
    if (!foodDescription.trim()) {
      toast.error("Veuillez entrer une description du repas ou de l'aliment");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeFoodWithGemini(foodDescription);
      
      if (result.success && result.calories && result.macros) {
        const weight = foodWeight ? parseInt(foodWeight) : undefined;
        
        // Add the analyzed food to the journal
        addFoodEntry({
          id: generateId(),
          name: result.foodName || foodDescription,
          calories: result.calories,
          macros: result.macros,
          timestamp: new Date().toISOString(),
          weight: weight,
          // Store the Gemini prompt and response
          geminiData: {
            prompt: foodDescription,
            response: result
          }
        });
        
        toast.success("Repas ou aliment ajouté avec succès");
        setFoodDescription("");
        setFoodWeight("");
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
      <div className="relative flex items-center">
        <Input
          placeholder="Décrivez votre repas ou aliment (ex: 100g de poulet et une salade)"
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          className="pr-24"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAnalyze();
            }
          }}
          disabled={isAnalyzing}
        />
        <div className="absolute right-1 flex items-center gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
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
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="px-2"
              >
                <Settings size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div className="font-medium text-center">
                  Configurer l'API Gemini
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {isDemo ? (
                    <div className="p-2 bg-yellow-100 text-yellow-800 rounded mb-3">
                      Mode démo actif. Entrez votre clé API pour utiliser l'API Gemini.
                    </div>
                  ) : (
                    <div className="p-2 bg-green-100 text-green-800 rounded mb-3">
                      Clé API configurée. Vous utilisez l'API Gemini.
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      placeholder="Entrez votre clé API Gemini"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      type="password"
                    />
                    {apiKeyInput && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 bottom-1 px-2"
                        onClick={() => setApiKeyInput("")}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleSaveApiKey}
                  disabled={!apiKeyInput || apiKeyInput === apiKey}
                >
                  Enregistrer la clé API
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Votre clé API est stockée localement dans votre navigateur.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-shrink-0 w-20">
          <Input
            type="number"
            placeholder="Poids (g)"
            value={foodWeight}
            onChange={(e) => setFoodWeight(e.target.value)}
            className="w-full"
            disabled={isAnalyzing}
          />
        </div>
        <p className="text-xs text-muted-foreground flex-grow pt-2">
          {isDemo ? 
            "Mode démo actif. Cliquez sur l'icône ⚙️ pour configurer l'API Gemini" :
            "Décrivez votre repas ou aliment pour une analyse automatique avec Gemini"
          }
        </p>
      </div>
    </div>
  );
};

export default GeminiInputForm;

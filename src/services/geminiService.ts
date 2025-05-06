
import { toast } from "sonner";
import { GeminiAnalysisResponse } from "@/types";

// Fonction d'analyse alimentaire avec Gemini
export const analyzeFoodWithGemini = async (
  description: string
): Promise<GeminiAnalysisResponse> => {
  // Vérifier si une clé API est disponible
  const apiKey = localStorage.getItem("gemini_api_key");
  
  if (!apiKey) {
    // Simuler l'analyse sans API (pour la démonstration)
    return simulateGeminiAnalysis(description);
  }

  try {
    // Dans une vraie implémentation, nous ferions un appel API à Gemini ici
    // Mais pour cette démo, nous simulons toujours la réponse
    return simulateGeminiAnalysis(description);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      success: false,
      errorMessage: "Erreur de connexion à l'API Gemini"
    };
  }
};

// Fonction simulant l'analyse alimentaire (pour la démo)
const simulateGeminiAnalysis = (description: string): Promise<GeminiAnalysisResponse> => {
  // Simuler un délai de traitement
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simuler une analyse basée sur des mots-clés
      if (description.toLowerCase().includes("salade")) {
        resolve({
          success: true,
          foodName: "Salade composée",
          calories: 250,
          macros: {
            protein: 8,
            carbs: 15,
            fat: 18
          }
        });
      } else if (description.toLowerCase().includes("poulet")) {
        resolve({
          success: true,
          foodName: "Poulet grillé",
          calories: 165,
          macros: {
            protein: 31,
            carbs: 0,
            fat: 3.6
          }
        });
      } else if (description.toLowerCase().includes("pasta") || description.toLowerCase().includes("pâtes")) {
        resolve({
          success: true,
          foodName: "Pâtes à la sauce tomate",
          calories: 320,
          macros: {
            protein: 12,
            carbs: 58,
            fat: 6
          }
        });
      } else {
        // Valeurs par défaut pour tout autre texte
        resolve({
          success: true,
          foodName: description,
          calories: 300,
          macros: {
            protein: 10,
            carbs: 30,
            fat: 15
          }
        });
      }
    }, 1000); // Délai simulé de 1 seconde
  });
};

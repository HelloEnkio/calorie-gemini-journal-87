
import { FoodEntry, MacroNutrients, GeminiAnalysisResult } from "@/types";

// Récupère la clé API depuis le localStorage
export const getGeminiApiKey = (): string => {
  return localStorage.getItem("gemini-api-key") || "DEMO_KEY";
};

// Enregistre la clé API dans le localStorage
export const setGeminiApiKey = (key: string): void => {
  localStorage.setItem("gemini-api-key", key);
};

// Analyse un aliment avec l'API Gemini
export const analyzeFoodWithGemini = async (
  foodDescription: string,
  weight?: number
): Promise<GeminiAnalysisResult> => {
  const apiKey = getGeminiApiKey();
  
  // Mode démo pour les tests sans clé API
  if (apiKey === "DEMO_KEY") {
    console.log("Using demo mode for Gemini analysis");
    return simulateDemoAnalysis(foodDescription, weight);
  }
  
  try {
    // Construction du prompt en incluant le poids si fourni
    let prompt = `Analyze the following food item and provide nutritional information:
      "${foodDescription}"
      ${weight ? `The weight is ${weight} grams.` : ""}
      
      Return the result in valid JSON format with the following structure:
      {
        "foodName": "name of the food",
        "calories": number of calories,
        "macros": {
          "protein": grams of protein,
          "carbs": grams of carbohydrates,
          "fat": grams of fat
        }
      }
      
      Calculate the values based on the actual weight if provided, otherwise use standard portion.
      Return ONLY the JSON without any additional text.`;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      return {
        success: false,
        errorMessage: data.error.message || "Erreur d'API Gemini",
      };
    }

    const textResult = data.candidates[0].content.parts[0].text;
    
    // Extraire la partie JSON de la réponse
    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        errorMessage: "Format de réponse non valide",
      };
    }
    
    const jsonResult = JSON.parse(jsonMatch[0]);
    
    return {
      success: true,
      foodName: jsonResult.foodName,
      calories: Number(jsonResult.calories),
      macros: {
        protein: Number(jsonResult.macros.protein),
        carbs: Number(jsonResult.macros.carbs),
        fat: Number(jsonResult.macros.fat),
      },
    };
  } catch (error) {
    console.error("Error analyzing food with Gemini:", error);
    return {
      success: false,
      errorMessage: "Erreur de communication avec l'API Gemini",
    };
  }
};

// Fonction pour le mode démo (sans appel API réel)
const simulateDemoAnalysis = (
  foodDescription: string,
  weight?: number
): GeminiAnalysisResult => {
  console.log(`Demo analysis for: "${foodDescription}", weight: ${weight || "not specified"}`);
  
  const foodDescLower = foodDescription.toLowerCase();
  
  let baseCalories = 0;
  let baseProtein = 0;
  let baseCarbs = 0;
  let baseFat = 0;
  let name = "";
  
  // Analyse simplifiée basée sur des mots-clés
  if (foodDescLower.includes("riz")) {
    name = "Riz";
    baseCalories = 130;
    baseProtein = 2.7;
    baseCarbs = 28;
    baseFat = 0.3;
  } else if (foodDescLower.includes("poulet") || foodDescLower.includes("chicken")) {
    name = "Poulet";
    baseCalories = 165;
    baseProtein = 31;
    baseCarbs = 0;
    baseFat = 3.6;
  } else if (foodDescLower.includes("salade")) {
    name = "Salade";
    baseCalories = 15;
    baseProtein = 1.5;
    baseCarbs = 2;
    baseFat = 0.2;
  } else if (foodDescLower.includes("pomme") || foodDescLower.includes("apple")) {
    name = "Pomme";
    baseCalories = 52;
    baseProtein = 0.3;
    baseCarbs = 14;
    baseFat = 0.2;
  } else if (foodDescLower.includes("pâtes") || foodDescLower.includes("pasta")) {
    name = "Pâtes";
    baseCalories = 131;
    baseProtein = 5;
    baseCarbs = 25;
    baseFat = 1.1;
  } else if (foodDescLower.includes("pizza")) {
    name = "Pizza";
    baseCalories = 250;
    baseProtein = 11;
    baseCarbs = 31;
    baseFat = 10;
  } else if (foodDescLower.includes("pain") || foodDescLower.includes("bread")) {
    name = "Pain";
    baseCalories = 265;
    baseProtein = 9;
    baseCarbs = 49;
    baseFat = 3.2;
  } else if (foodDescLower.includes("oeufs") || foodDescLower.includes("œufs") || foodDescLower.includes("egg")) {
    name = "Œuf";
    baseCalories = 78;
    baseProtein = 6.3;
    baseCarbs = 0.6;
    baseFat = 5.3;
  } else {
    // Valeurs génériques par défaut
    name = foodDescription.length > 20 ? foodDescription.substring(0, 20) + "..." : foodDescription;
    baseCalories = 100;
    baseProtein = 5;
    baseCarbs = 15;
    baseFat = 3;
  }
  
  // Calcul basé sur le poids si fourni (pour 100g de base)
  const scaleFactor = weight ? weight / 100 : 1;
  
  return {
    success: true,
    foodName: name,
    calories: Math.round(baseCalories * scaleFactor),
    macros: {
      protein: Number((baseProtein * scaleFactor).toFixed(1)),
      carbs: Number((baseCarbs * scaleFactor).toFixed(1)),
      fat: Number((baseFat * scaleFactor).toFixed(1)),
    },
  };
};

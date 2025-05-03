
import { GeminiNutritionResponse } from "@/types";

// In a production app, this would be a real API key stored securely
// For demo purposes, we'll simulate the API response
const demoApiKey = "DEMO_KEY";

// Helper function to format the prompt for consistent results
const formatFoodAnalysisPrompt = (foodDescription: string): string => {
  return `Analyse nutritionnelle pour: "${foodDescription}"
  
  Je souhaite connaître les macronutriments et calories de cet aliment/repas.
  Réponds uniquement avec un objet JSON au format suivant, sans aucun texte additionnel:
  
  {
    "foodName": "nom du repas/aliment",
    "calories": nombre total de calories,
    "macros": {
      "protein": grammes de protéines,
      "carbs": grammes de glucides,
      "fat": grammes de lipides
    }
  }
  
  N'inclus aucune explication, uniquement l'objet JSON.`;
};

// Function to analyze food using Gemini API
export const analyzeFoodWithGemini = async (
  foodDescription: string
): Promise<GeminiNutritionResponse> => {
  try {
    // In a real app, we'd call the actual Gemini API
    // For demo purposes, we'll simulate a response

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo response based on common foods
    const lowerDescription = foodDescription.toLowerCase();
    
    if (lowerDescription.includes("poulet") && lowerDescription.includes("semoule") && lowerDescription.includes("yaourt")) {
      // Your example: "un peu de poulet, 100g de semoule et un yaourt de brebis"
      return {
        success: true,
        foodName: "Poulet avec semoule et yaourt de brebis",
        calories: 550,
        macros: {
          protein: 35,
          carbs: 65,
          fat: 10
        }
      };
    } else if (lowerDescription.includes("pizza")) {
      return {
        success: true,
        foodName: "Pizza",
        calories: 285,
        macros: {
          protein: 12,
          carbs: 36,
          fat: 10
        }
      };
    } else if (lowerDescription.includes("salade") || lowerDescription.includes("légumes")) {
      return {
        success: true,
        foodName: "Salade composée",
        calories: 180,
        macros: {
          protein: 5,
          carbs: 15,
          fat: 12
        }
      };
    } else if (lowerDescription.includes("pâtes") || lowerDescription.includes("spaghetti")) {
      return {
        success: true,
        foodName: "Pâtes à la sauce tomate",
        calories: 350,
        macros: {
          protein: 12,
          carbs: 70,
          fat: 5
        }
      };
    } else if (lowerDescription.includes("steak") || lowerDescription.includes("boeuf")) {
      return {
        success: true,
        foodName: "Steak de boeuf",
        calories: 350,
        macros: {
          protein: 40,
          carbs: 0,
          fat: 20
        }
      };
    } else {
      // Generic response for demo
      const wordCount = foodDescription.split(/\s+/).length;
      const calories = wordCount * 100;
      
      return {
        success: true,
        foodName: foodDescription.slice(0, 30) + (foodDescription.length > 30 ? "..." : ""),
        calories: calories,
        macros: {
          protein: Math.round(calories * 0.25 / 4),
          carbs: Math.round(calories * 0.45 / 4),
          fat: Math.round(calories * 0.3 / 9)
        }
      };
    }
    
    // In a real implementation, you would use:
    /*
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: formatFoodAnalysisPrompt(foodDescription) }] }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    // Parse the response to extract the JSON object
    const content = data.candidates[0].content;
    const textContent = content.parts[0].text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse nutrition data from response");
    }
    
    const nutritionData = JSON.parse(jsonMatch[0]);
    return {
      success: true,
      ...nutritionData
    };
    */
    
  } catch (error) {
    console.error("Error analyzing food with Gemini:", error);
    return {
      success: false,
      errorMessage: `Erreur lors de l'analyse: ${error instanceof Error ? error.message : "Erreur inconnue"}`
    };
  }
};

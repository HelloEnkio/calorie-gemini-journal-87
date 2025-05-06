
import { FoodItem, RecipeItem } from '@/types';

// Base de données simulée d'aliments
export const foodDatabase: FoodItem[] = [
  {
    id: "1",
    name: "Poulet grillé",
    calories: 165,
    macros: {
      protein: 31,
      carbs: 0,
      fat: 3.6,
    },
    weight: 100,
    category: "Viandes"
  },
  {
    id: "2",
    name: "Riz blanc cuit",
    calories: 130,
    macros: {
      protein: 2.7,
      carbs: 28.2,
      fat: 0.3,
    },
    weight: 100,
    category: "Céréales"
  },
  {
    id: "3",
    name: "Saumon",
    calories: 208,
    macros: {
      protein: 20,
      carbs: 0,
      fat: 13,
    },
    weight: 100,
    category: "Poissons"
  },
  {
    id: "4",
    name: "Banane",
    calories: 89,
    macros: {
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
    },
    weight: 100,
    category: "Fruits"
  },
  {
    id: "5",
    name: "Œuf entier",
    calories: 155,
    macros: {
      protein: 13,
      carbs: 1.1,
      fat: 11,
    },
    weight: 100,
    category: "Œufs et produits laitiers"
  },
  {
    id: "6",
    name: "Pain complet",
    calories: 247,
    macros: {
      protein: 13,
      carbs: 41,
      fat: 3,
    },
    weight: 100,
    category: "Céréales"
  },
  {
    id: "7",
    name: "Pomme",
    calories: 52,
    macros: {
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
    },
    weight: 100,
    category: "Fruits"
  },
  {
    id: "8",
    name: "Lentilles cuites",
    calories: 116,
    macros: {
      protein: 9,
      carbs: 20,
      fat: 0.4,
    },
    weight: 100,
    category: "Légumineuses"
  },
  {
    id: "9",
    name: "Yaourt nature",
    calories: 59,
    macros: {
      protein: 3.5,
      carbs: 4.7,
      fat: 3.3,
    },
    weight: 100,
    category: "Œufs et produits laitiers"
  },
  {
    id: "10",
    name: "Brocoli cuit",
    calories: 35,
    macros: {
      protein: 2.4,
      carbs: 7.2,
      fat: 0.4,
    },
    weight: 100,
    category: "Légumes"
  },
  {
    id: "11",
    name: "Fromage cheddar",
    calories: 402,
    macros: {
      protein: 25,
      carbs: 1.3,
      fat: 33.1,
    },
    weight: 100,
    category: "Œufs et produits laitiers"
  },
  {
    id: "12",
    name: "Pâtes cuites",
    calories: 158,
    macros: {
      protein: 5.8,
      carbs: 31,
      fat: 0.9,
    },
    weight: 100,
    category: "Céréales"
  },
  {
    id: "13",
    name: "Steak de bœuf",
    calories: 271,
    macros: {
      protein: 26,
      carbs: 0,
      fat: 19,
    },
    weight: 100,
    category: "Viandes"
  },
  {
    id: "14",
    name: "Avocat",
    calories: 160,
    macros: {
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
    },
    weight: 100,
    category: "Fruits"
  },
  {
    id: "15",
    name: "Lait entier",
    calories: 61,
    macros: {
      protein: 3.2,
      carbs: 4.8,
      fat: 3.6,
    },
    weight: 100,
    category: "Œufs et produits laitiers"
  },
  {
    id: "16",
    name: "Patate douce",
    calories: 86,
    macros: {
      protein: 1.6,
      carbs: 20.1,
      fat: 0.1,
    },
    weight: 100,
    category: "Légumes"
  },
  {
    id: "17",
    name: "Amandes",
    calories: 579,
    macros: {
      protein: 21.1,
      carbs: 21.7,
      fat: 49.9,
    },
    weight: 100,
    category: "Fruits à coque"
  },
  {
    id: "18",
    name: "Quinoa cuit",
    calories: 120,
    macros: {
      protein: 4.4,
      carbs: 21.3,
      fat: 1.9,
    },
    weight: 100,
    category: "Céréales"
  },
  {
    id: "19",
    name: "Salade verte",
    calories: 15,
    macros: {
      protein: 1.4,
      carbs: 2.9,
      fat: 0.2,
    },
    weight: 100,
    category: "Légumes"
  },
  {
    id: "20",
    name: "Thon en conserve",
    calories: 116,
    macros: {
      protein: 25.5,
      carbs: 0,
      fat: 1,
    },
    weight: 100,
    category: "Poissons"
  }
];

// Base de données des recettes
export const recipeDatabase: RecipeItem[] = [];

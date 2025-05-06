
import { useState, useEffect, useRef } from "react";
import { FoodItem } from "@/types";
import { searchFoods } from "@/utils/foodDatabase";

export const useFoodSuggestions = (foodName: string) => {
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Rechercher des suggestions lorsque le nom de l'aliment change
  useEffect(() => {
    // Ne rechercher que si le nom a au moins 2 caractères
    if (foodName.length >= 2) {
      setIsSearching(true);
      const results = searchFoods(foodName);
      setSuggestions(results);
      setShowSuggestions(true);
      setIsSearching(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [foodName]);

  // Fermer les suggestions lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fonction pour gérer le focus sur l'input
  const handleInputFocus = () => {
    if (foodName.length >= 2) {
      setIsSearching(true);
      const results = searchFoods(foodName);
      setSuggestions(results);
      setShowSuggestions(true);
      setIsSearching(false);
    }
  };

  // Fonction pour cacher explicitement les suggestions
  const hideSuggestions = () => {
    setShowSuggestions(false);
  };

  return {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isSearching,
    handleInputFocus,
    hideSuggestions,
    inputRef,
    suggestionRef
  };
};

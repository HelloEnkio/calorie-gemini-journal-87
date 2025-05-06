
import { useState, useEffect, useRef } from "react";
import { searchFoods } from "@/utils/foodDatabase";
import { FoodItem } from "@/types";

export const useFoodSuggestions = (foodName: string) => {
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Search for food items when user types
  useEffect(() => {
    if (foodName.length > 0 && showSuggestions) {
      setIsSearching(true);
      const results = searchFoods(foodName);
      setSuggestions(results);
      setIsSearching(false);
    } else if (foodName.length === 0) {
      setSuggestions([]);
    }
  }, [foodName, showSuggestions]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show suggestions when input is focused
  const handleInputFocus = () => {
    if (foodName.length > 0) {
      setIsSearching(true);
      const results = searchFoods(foodName);
      setSuggestions(results);
      setShowSuggestions(true);
      setIsSearching(false);
    }
  };
  
  // Hide suggestions explicitly
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

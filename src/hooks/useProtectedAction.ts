
import { useAuth } from "@/contexts/AuthContext";

// Hook pour protéger les actions qui requierent un compte
export const useProtectedAction = () => {
  const { isLoggedIn, setShowAuthModal } = useAuth();
  
  const protectAction = (callback: () => void) => {
    if (!isLoggedIn) {
      // Si l'utilisateur n'est pas connecté, on montre le modal d'inscription
      setShowAuthModal(true);
    } else {
      // Si l'utilisateur est connecté, on exécute simplement l'action
      callback();
    }
  };
  
  return { protectAction };
};

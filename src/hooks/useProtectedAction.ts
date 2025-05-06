
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useProtectedAction = () => {
  const { isLoggedIn, setShowAuthModal } = useAuth();
  
  /**
   * Protège une action qui nécessite d'être connecté
   * @param action La fonction à exécuter si l'utilisateur est connecté
   * @param showToast Afficher un message toast en cas d'échec (par défaut: true)
   * @returns Une fonction qui vérifie l'état de connexion avant d'exécuter l'action
   */
  const protectAction = (action: () => void, showToast = true) => {
    if (isLoggedIn) {
      action();
    } else {
      if (showToast) {
        toast.error("Vous devez être connecté pour effectuer cette action");
      }
      setShowAuthModal(true);
    }
  };
  
  return { protectAction };
};

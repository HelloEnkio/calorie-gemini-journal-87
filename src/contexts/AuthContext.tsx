
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types pour le contexte d'authentification
export type SubscriptionPlan = "free" | "premium";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  subscriptionPlan: SubscriptionPlan | null;
  login: (email: string, password: string, plan?: SubscriptionPlan | null) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

// Créer le contexte avec des valeurs par défaut
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  username: null,
  subscriptionPlan: null,
  login: () => {},
  logout: () => {},
  showAuthModal: false,
  setShowAuthModal: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  
  // Charger l'état d'authentification à partir du localStorage au chargement
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth-state');
    
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setIsLoggedIn(parsedAuth.isLoggedIn || false);
        setUsername(parsedAuth.username || null);
        setSubscriptionPlan(parsedAuth.subscriptionPlan || null);
      } catch (e) {
        console.error('Erreur lors du chargement de l\'état d\'authentification:', e);
      }
    }
  }, []);
  
  // Connecter l'utilisateur
  const login = (email: string, password: string, plan: SubscriptionPlan | null = null) => {
    // Dans une vraie application, nous ferions une requête API ici
    // Pour cette démo, on simule une connexion réussie
    const userInfo = {
      isLoggedIn: true,
      username: email.split('@')[0],
      subscriptionPlan: plan || 'free' as SubscriptionPlan,
    };
    
    // Mettre à jour l'état
    setIsLoggedIn(true);
    setUsername(userInfo.username);
    setSubscriptionPlan(userInfo.subscriptionPlan);
    
    // Enregistrer dans localStorage
    localStorage.setItem('auth-state', JSON.stringify(userInfo));
  };
  
  // Déconnecter l'utilisateur
  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setSubscriptionPlan(null);
    
    // Supprimer du localStorage
    localStorage.removeItem('auth-state');
  };
  
  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      username,
      subscriptionPlan,
      login,
      logout,
      showAuthModal,
      setShowAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);


import React, { createContext, useState, useContext, ReactNode } from "react";

// Types des plans d'abonnement
export type SubscriptionPlan = "free" | "premium" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  subscriptionPlan: SubscriptionPlan;
  login: (email: string, password: string, plan: SubscriptionPlan) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Utilisateur");
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const login = (email: string, password: string, plan: SubscriptionPlan) => {
    // Dans une vraie application, on ferait une requête API ici
    setIsLoggedIn(true);
    setUsername(email.split('@')[0]);
    // Si un plan est spécifié (lors de l'inscription), on l'utilise
    // Sinon, on utilise simplement "free" comme valeur par défaut pour la connexion
    setSubscriptionPlan(plan || "free");
    setShowAuthModal(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("Utilisateur");
    setSubscriptionPlan(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        username, 
        subscriptionPlan,
        login, 
        logout, 
        showAuthModal, 
        setShowAuthModal 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

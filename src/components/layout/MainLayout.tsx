
import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isLoggedIn, username, logout, setShowAuthModal, subscriptionPlan } = useAuth();

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setShowAuthModal(true);
    // On définit un délai pour laisser le modal s'ouvrir d'abord
    setTimeout(() => {
      // Simuler un clic sur le bouton "S'inscrire"
      document.getElementById("signup-button")?.click();
    }, 100);
  };

  return (
    <div className="main-layout">
      <div className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md bg-background/80 px-4 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <span className="font-medium text-lg">Nutrition Tracker</span>
          {subscriptionPlan === "premium" && (
            <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
              Premium
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                <AvatarFallback className="bg-primary/10">
                  <UserRound className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">{isLoggedIn ? username : "Non connecté"}</p>
                {isLoggedIn && subscriptionPlan && (
                  <p className="text-xs text-muted-foreground">
                    Plan {subscriptionPlan === "premium" ? "Premium" : "Gratuit"}
                  </p>
                )}
              </div>
              <DropdownMenuSeparator />
              
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem className="rounded-lg">Mon profil</DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">Mes préférences</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="rounded-lg text-destructive">Déconnexion</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleLogin} className="rounded-lg">Connexion</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignup} className="rounded-lg">Créer un compte</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="page-container pt-16">
        {children || <Outlet />}
      </div>
      <NavigationBar />
      <AuthModal />
      
      {/* Bouton caché pour déclencher l'inscription */}
      <button 
        id="signup-button" 
        onClick={() => document.getElementById("register-trigger")?.click()} 
        className="hidden"
      />
    </div>
  );
};

export default MainLayout;

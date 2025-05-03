
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

  return (
    <div className="main-layout">
      <div className="fixed top-0 left-0 right-0 h-12 border-b bg-background px-4 z-10 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium">Nutrition Tracker</span>
          {subscriptionPlan === "premium" && (
            <span className="ml-2 bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
              Premium
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-primary/10">
                  <UserRound className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
                  <DropdownMenuItem>Mon profil</DropdownMenuItem>
                  <DropdownMenuItem>Mes préférences</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleLogin}>Connexion</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogin}>Créer un compte</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="page-container pt-12">
        {children || <Outlet />}
      </div>
      <NavigationBar />
      <AuthModal />
    </div>
  );
};

export default MainLayout;

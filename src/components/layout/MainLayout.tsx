
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  // État pour simuler un utilisateur connecté
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Utilisateur");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUsername("John Doe");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("Utilisateur");
  };

  return (
    <div className="main-layout">
      <div className="fixed top-0 left-0 right-0 h-12 border-b bg-background px-4 z-10 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-medium">Nutrition Tracker</span>
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
                {isLoggedIn && (
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                )}
              </div>
              <DropdownMenuSeparator />
              
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem>Mon profil</DropdownMenuItem>
                  <DropdownMenuItem>Mes préférences</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleLogin}>Connexion</DropdownMenuItem>
                  <DropdownMenuItem>Créer un compte</DropdownMenuItem>
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
    </div>
  );
};

export default MainLayout;

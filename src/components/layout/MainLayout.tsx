
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigationBar from "./NavigationBar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="main-layout">
      <div className="fixed top-0 left-0 right-0 h-12 border-b bg-background px-4 z-10 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-primary/10">
              <UserRound className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
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

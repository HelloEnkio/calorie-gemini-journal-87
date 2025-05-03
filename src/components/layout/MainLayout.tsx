
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigationBar from "./NavigationBar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="main-layout">
      <div className="page-container">
        {children || <Outlet />}
      </div>
      <NavigationBar />
    </div>
  );
};

export default MainLayout;

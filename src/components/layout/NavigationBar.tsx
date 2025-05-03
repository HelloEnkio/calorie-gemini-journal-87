
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  BarChart, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/" ? "journal" : 
    location.pathname === "/stats" ? "stats" :
    location.pathname === "/settings" ? "settings" : "journal"
  );
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case "journal":
        navigate("/");
        break;
      case "stats":
        navigate("/stats");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        navigate("/");
        break;
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg z-10">
      <div className="px-4 py-2 max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 h-16 rounded-xl bg-muted/80 p-1">
            <TabsTrigger 
              value="journal" 
              className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <Calendar 
                className={cn(
                  "h-5 w-5", 
                  activeTab === "journal" ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className="text-xs">Journal</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <BarChart 
                className={cn(
                  "h-5 w-5", 
                  activeTab === "stats" ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className="text-xs">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <Settings 
                className={cn(
                  "h-5 w-5", 
                  activeTab === "settings" ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className="text-xs">Param.</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default NavigationBar;

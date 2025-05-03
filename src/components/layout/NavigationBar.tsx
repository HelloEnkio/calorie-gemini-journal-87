
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  PieChart, 
  BarChart, 
  Trophy 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/" ? "journal" : 
    location.pathname === "/stats" ? "stats" :
    location.pathname === "/achievements" ? "achievements" : "journal"
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
      case "achievements":
        navigate("/achievements");
        break;
      default:
        navigate("/");
        break;
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="px-2 py-1 max-w-md mx-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 h-16">
            <TabsTrigger 
              value="journal" 
              className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-muted"
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
              className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-muted"
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
              value="achievements" 
              className="flex flex-col items-center justify-center space-y-1 data-[state=active]:bg-muted"
            >
              <Trophy 
                className={cn(
                  "h-5 w-5", 
                  activeTab === "achievements" ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className="text-xs">Succès</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default NavigationBar;

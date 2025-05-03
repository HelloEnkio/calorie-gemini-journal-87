
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { addDays, subDays } from "date-fns";

interface JournalDateNavigatorProps {
  currentDate: Date;
  dateFormatted: string;
  navigateToDay: (date: Date) => void;
  goToToday: () => void;
  isToday: boolean;
}

const JournalDateNavigator = ({
  currentDate,
  dateFormatted,
  navigateToDay,
  goToToday,
  isToday
}: JournalDateNavigatorProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Journal nutritionnel</h1>
        {!isToday && (
          <Button variant="outline" size="sm" onClick={goToToday} className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Aujourd'hui</span>
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={() => navigateToDay(subDays(currentDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Jour précédent</span>
        </Button>
        
        <p className="text-center text-muted-foreground capitalize">{dateFormatted}</p>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          onClick={() => navigateToDay(addDays(currentDate, 1))}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Jour suivant</span>
        </Button>
      </div>
    </div>
  );
};

export default JournalDateNavigator;

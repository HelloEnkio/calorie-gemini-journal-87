
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DateRangeSelectorProps {
  dateRange: "week" | "month" | "custom";
  startDate: string;
  endDate: string;
  logsCount: number;
  dateRangeDescription: string;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateRangeSelector = ({
  dateRange,
  startDate,
  endDate,
  logsCount,
  dateRangeDescription,
  onStartDateChange,
  onEndDateChange
}: DateRangeSelectorProps) => {
  return (
    <>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="week">7 jours</TabsTrigger>
        <TabsTrigger value="month">30 jours</TabsTrigger>
        <TabsTrigger value="custom">Personnalisé</TabsTrigger>
      </TabsList>
      
      {dateRange === "custom" && (
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Date de début</Label>
            <Input 
              id="start-date"
              type="date" 
              value={startDate}
              onChange={onStartDateChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">Date de fin</Label>
            <Input 
              id="end-date"
              type="date" 
              value={endDate}
              onChange={onEndDateChange}
            />
          </div>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground mb-4 flex items-center">
        <Calendar className="h-4 w-4 mr-1" /> 
        <span>{dateRangeDescription} ({logsCount} jours)</span>
      </div>
    </>
  );
};

export default DateRangeSelector;

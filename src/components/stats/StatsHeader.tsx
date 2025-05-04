
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateRangeSelector from "@/components/stats/DateRangeSelector";
import { DateRangeType } from "@/utils/statsCalculations";

interface StatsHeaderProps {
  dateRange: DateRangeType;
  startDate: string;
  endDate: string;
  logsCount: number;
  dateRangeDescription: string;
  onDateRangeChange: (value: DateRangeType) => void;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StatsHeader = ({
  dateRange,
  startDate,
  endDate,
  logsCount,
  dateRangeDescription,
  onDateRangeChange,
  onStartDateChange,
  onEndDateChange
}: StatsHeaderProps) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Statistiques</h1>
        <p className="text-muted-foreground">Analysez vos progrès et tendances</p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Tabs 
              defaultValue="week" 
              value={dateRange} 
              onValueChange={(value) => onDateRangeChange(value as DateRangeType)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-4 w-full">
                <TabsTrigger value="week">7 jours</TabsTrigger>
                <TabsTrigger value="month">30 jours</TabsTrigger>
                <TabsTrigger value="all">Tout</TabsTrigger>
                <TabsTrigger value="custom">Personnalisé</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DateRangeSelector 
              dateRange={dateRange}
              startDate={startDate}
              endDate={endDate}
              logsCount={logsCount}
              dateRangeDescription={dateRangeDescription}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StatsHeader;


import { Card, CardContent } from "@/components/ui/card";
import WeightEntryForm from "@/components/weight/WeightEntryForm";
import { DailyLog } from "@/types";
import { getImageUrl } from "@/utils/imageStorage";

interface WeightTabProps {
  dayLog: DailyLog;
  refreshData: () => void;
}

const WeightTab = ({ dayLog, refreshData }: WeightTabProps) => {
  // Récupérer l'URL de la photo si disponible
  const photoUrl = dayLog.weight?.photoUrl ? getImageUrl(dayLog.weight.photoUrl) : null;

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Suivi du poids</h2>
      
      <WeightEntryForm onAdd={refreshData} />
      
      {dayLog.weight && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-sm font-medium mb-2">Poids du jour</h3>
                <div className="text-3xl font-bold mb-1">{dayLog.weight.weight} kg</div>
                {dayLog.weight.notes && (
                  <div className="text-sm text-muted-foreground">{dayLog.weight.notes}</div>
                )}
              </div>
              
              {photoUrl && (
                <div className="relative w-24 h-24 overflow-hidden rounded-md border">
                  <img 
                    src={photoUrl} 
                    alt="Photo de suivi" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {!dayLog.weight && (
        <div className="text-center py-6 text-muted-foreground">
          <p>Aucun poids enregistré ce jour</p>
          <p className="text-sm">Utilisez le formulaire ci-dessus pour enregistrer votre poids</p>
        </div>
      )}
    </div>
  );
};

export default WeightTab;

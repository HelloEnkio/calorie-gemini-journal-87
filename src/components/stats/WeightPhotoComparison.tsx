
import { useState, useEffect } from "react";
import { DailyLog } from "@/types";
import { getImageUrl } from "@/utils/imageStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { Images } from "lucide-react";

interface WeightPhotoComparisonProps {
  logs: DailyLog[];
}

interface PhotoEntry {
  date: string;
  formattedDate: string;
  weight: number;
  photoUrl: string;
  imageData: string;
}

const WeightPhotoComparison = ({ logs }: WeightPhotoComparisonProps) => {
  const [photoEntries, setPhotoEntries] = useState<PhotoEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [oldestPhoto, setOldestPhoto] = useState<PhotoEntry | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<PhotoEntry | null>(null);
  
  // Récupérer toutes les entrées avec photos
  useEffect(() => {
    const entriesWithPhotos = logs
      .filter(log => log.weight?.photoUrl)
      .map(log => {
        const photoUrl = log.weight!.photoUrl!;
        const imageData = getImageUrl(photoUrl) || "";
        
        if (!imageData) return null;
        
        const formattedDate = format(
          parse(log.date, "yyyy-MM-dd", new Date()),
          "d MMMM yyyy",
          { locale: fr }
        );
        
        return {
          date: log.date,
          formattedDate,
          weight: log.weight!.weight,
          photoUrl,
          imageData
        };
      })
      .filter(Boolean) as PhotoEntry[];
    
    // Trier par date (du plus ancien au plus récent)
    entriesWithPhotos.sort((a, b) => a.date.localeCompare(b.date));
    
    setPhotoEntries(entriesWithPhotos);
    
    // Définir la photo la plus ancienne
    if (entriesWithPhotos.length > 0) {
      setOldestPhoto(entriesWithPhotos[0]);
      setCurrentPhoto(entriesWithPhotos[entriesWithPhotos.length - 1]);
    }
  }, [logs]);
  
  // Mettre à jour la photo actuelle lorsque le slider change
  const handleSliderChange = (value: number[]) => {
    const index = value[0];
    setSelectedIndex(index);
    setCurrentPhoto(photoEntries[index]);
  };
  
  // Si aucune photo n'est disponible
  if (photoEntries.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Images className="h-5 w-5 text-primary" />
            Comparaison photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>Pas encore de photos disponibles</p>
            <p className="text-sm">Ajoutez des photos lorsque vous enregistrez votre poids dans le journal</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Images className="h-5 w-5 text-primary" />
          Comparaison photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Photos avant/après */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {oldestPhoto && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground text-center">Début</div>
                <div className="relative aspect-square overflow-hidden rounded-md border">
                  <img 
                    src={oldestPhoto.imageData} 
                    alt={`Photo du ${oldestPhoto.formattedDate}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center text-xs">
                  <div className="font-medium">{oldestPhoto.formattedDate}</div>
                  <div>{oldestPhoto.weight} kg</div>
                </div>
              </div>
            )}
            
            {currentPhoto && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground text-center">
                  {currentPhoto === oldestPhoto ? "Même jour" : "Actuel"}
                </div>
                <div className="relative aspect-square overflow-hidden rounded-md border">
                  <img 
                    src={currentPhoto.imageData} 
                    alt={`Photo du ${currentPhoto.formattedDate}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center text-xs">
                  <div className="font-medium">{currentPhoto.formattedDate}</div>
                  <div>{currentPhoto.weight} kg</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Curseur de navigation */}
        {photoEntries.length > 1 && (
          <div className="mt-6">
            <Separator className="mb-4" />
            <div className="space-y-2">
              <Slider
                value={[selectedIndex]}
                min={0}
                max={photoEntries.length - 1}
                step={1}
                onValueChange={handleSliderChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{photoEntries[0].formattedDate}</span>
                <span>{photoEntries[photoEntries.length - 1].formattedDate}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Différence de poids */}
        {oldestPhoto && currentPhoto && oldestPhoto !== currentPhoto && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Différence de poids</div>
              <div className={`text-lg font-bold ${
                currentPhoto.weight < oldestPhoto.weight 
                  ? 'text-emerald-500' 
                  : currentPhoto.weight > oldestPhoto.weight
                    ? 'text-rose-500'
                    : ''
              }`}>
                {currentPhoto.weight < oldestPhoto.weight ? '-' : '+'}{Math.abs(currentPhoto.weight - oldestPhoto.weight).toFixed(1)} kg
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightPhotoComparison;

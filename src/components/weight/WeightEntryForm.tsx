
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightEntry } from "@/types";
import { addWeightEntry } from "@/utils/storage";
import { generateId } from "@/utils/storage/core";
import { getTodaysLog } from "@/utils/storage/logs";
import { toast } from "sonner";
import { useProtectedAction } from "@/hooks/useProtectedAction";
import { ScaleIcon, Upload, Image } from "lucide-react";
import { saveImage } from "@/utils/imageStorage";

interface WeightEntryFormProps {
  onAdd?: () => void;
}

const WeightEntryForm = ({ onAdd }: WeightEntryFormProps) => {
  const { protectAction } = useProtectedAction();
  const todayLog = getTodaysLog();
  const [weight, setWeight] = useState<string>(
    todayLog.weight ? todayLog.weight.weight.toString() : ""
  );
  const [notes, setNotes] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      toast.error("Veuillez saisir un poids valide");
      return;
    }
    
    setIsUploading(true);
    
    try {
      let photoUrl: string | undefined = undefined;
      
      if (selectedFile) {
        photoUrl = await saveImage(selectedFile);
      }
      
      const newEntry: WeightEntry = {
        id: generateId(),
        weight: Number(weight),
        timestamp: new Date().toISOString(),
      };
      
      if (notes.trim()) {
        newEntry.notes = notes.trim();
      }
      
      if (photoUrl) {
        newEntry.photoUrl = photoUrl;
      }
      
      addWeightEntry(newEntry);
      toast.success("Poids enregistré");
      
      // Reset form
      setWeight("");
      setNotes("");
      setSelectedFile(null);
      setPhotoPreview(null);
      
      if (onAdd) onAdd();
    } catch (error) {
      console.error("Error saving weight entry:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProtectedSubmit = () => {
    protectAction(() => handleSubmit());
  };
  
  return (
    <Card className="modern-card mb-4 overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-base flex items-center gap-2">
          <ScaleIcon className="h-5 w-5 text-primary" />
          Enregistrer votre poids
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Ex: 70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="floating-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes (optionnel)</Label>
            <Input
              id="notes"
              placeholder="Ex: Après le petit déjeuner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="floating-input"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="photo" className="text-sm font-medium text-muted-foreground">Photo (optionnel)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
              >
                <Upload className="h-3 w-3 mr-1" />
                Ajouter une photo
              </Button>
            </div>
            <input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {photoPreview && (
              <div className="relative mt-2">
                <div className="relative w-24 h-24 overflow-hidden rounded-md border">
                  <img 
                    src={photoPreview} 
                    alt="Aperçu" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-1 rounded-full bg-background/80"
                  onClick={() => {
                    setSelectedFile(null);
                    setPhotoPreview(null);
                  }}
                >
                  ✕
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleProtectedSubmit} 
          className="w-full modern-button"
          disabled={isUploading}
        >
          {isUploading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WeightEntryForm;

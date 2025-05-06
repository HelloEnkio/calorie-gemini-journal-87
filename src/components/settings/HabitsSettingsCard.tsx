
import { useState, useEffect } from "react";
import { Habit } from "@/types";
import { getAllHabits, addHabit, updateHabit, deleteHabit } from "@/utils/habitsStorage";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit, Flame } from "lucide-react";
import { toast } from "sonner";

const EMOJI_LIST = [
  "💧", "🧘", "🏃", "🥗", "🍎", "🥦", "💪", "🧠", "📚", "✍️", 
  "🚶", "🚫", "🚬", "🍺", "🧹", "😴", "🌞", "💊", "💻", "👣"
];

const COLOR_LIST = [
  "#3b82f6", "#8b5cf6", "#ef4444", "#f59e0b", "#10b981",
  "#06b6d4", "#6366f1", "#ec4899", "#14b8a6", "#f43f5e",
];

const HabitsSettingsCard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitDialogOpen, setNewHabitDialogOpen] = useState(false);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "💧",
    color: "#3b82f6",
    frequency: "daily" as "daily" | "weekly",
    active: true
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    // Initialize default habits if necessary
    const currentHabits = getAllHabits();
    if (currentHabits.length === 0) {
      // Create some default habits here
      addHabit({
        name: "Boire 2L d'eau",
        description: "Boire suffisamment d'eau chaque jour",
        icon: "💧",
        color: "#3b82f6",
        frequency: "daily",
        active: true
      });
      
      addHabit({
        name: "Méditation",
        description: "10 minutes de méditation par jour",
        icon: "🧘",
        color: "#8b5cf6",
        frequency: "daily",
        active: true
      });
      
      addHabit({
        name: "5 fruits et légumes",
        description: "Consommer au moins 5 portions de fruits et légumes",
        icon: "🥗",
        color: "#10b981",
        frequency: "daily",
        active: true
      });
    }
    
    // Load all habits
    setHabits(getAllHabits());
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddHabit = () => {
    if (!formData.name.trim()) {
      toast.error("Veuillez saisir un nom d'habitude");
      return;
    }

    addHabit({
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      frequency: formData.frequency,
      active: formData.active
    });
    
    loadHabits();
    setNewHabitDialogOpen(false);
    resetForm();
    toast.success("Habitude ajoutée avec succès");
  };

  const handleEditHabit = () => {
    if (!editingHabit || !formData.name.trim()) {
      toast.error("Veuillez saisir un nom d'habitude");
      return;
    }

    updateHabit(editingHabit.id, {
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      frequency: formData.frequency,
      active: formData.active
    });
    
    loadHabits();
    setEditHabitDialogOpen(false);
    setEditingHabit(null);
    resetForm();
    toast.success("Habitude mise à jour");
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette habitude ?")) {
      deleteHabit(habitId);
      loadHabits();
      toast.success("Habitude supprimée");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "💧",
      color: "#3b82f6",
      frequency: "daily",
      active: true
    });
  };

  const prepareEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description || "",
      icon: habit.icon || "💧",
      color: habit.color || "#3b82f6",
      frequency: habit.frequency || "daily",
      active: habit.active
    });
    setEditHabitDialogOpen(true);
  };

  const handleToggleActive = (habit: Habit) => {
    updateHabit(habit.id, { active: !habit.active });
    loadHabits();
    toast.success(`Habitude ${habit.active ? 'désactivée' : 'activée'}`);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Habitudes</CardTitle>
          <CardDescription>
            Configurez les habitudes que vous souhaitez suivre quotidiennement
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {habits.length > 0 ? (
              habits.map((habit) => (
                <div 
                  key={habit.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center">
                    <div 
                      className="text-xl mr-3" 
                      style={{ color: habit.color || undefined }}
                    >
                      {habit.icon || "✅"}
                    </div>
                    <div>
                      <div className="font-medium flex items-center">
                        {habit.name}
                        {habit.streak && habit.streak > 0 && (
                          <Badge variant="outline" className="ml-2 bg-orange-50 text-orange-700">
                            <Flame className="h-3 w-3 mr-1" />
                            {habit.streak}
                          </Badge>
                        )}
                      </div>
                      {habit.description && (
                        <div className="text-xs text-muted-foreground">{habit.description}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={habit.active}
                      onCheckedChange={() => handleToggleActive(habit)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => prepareEditHabit(habit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground mb-2">
                  Aucune habitude n'est configurée
                </p>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={() => setNewHabitDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une habitude
          </Button>
        </CardFooter>
      </Card>
      
      {/* Dialog d'ajout d'habitude */}
      <Dialog open={newHabitDialogOpen} onOpenChange={setNewHabitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une habitude</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Nom</Label>
              <Input 
                id="habit-name" 
                placeholder="Ex: Boire 2L d'eau" 
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="habit-desc">Description (optionnelle)</Label>
              <Textarea 
                id="habit-desc" 
                placeholder="Description de l'habitude" 
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="max-h-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Icône</Label>
              <div className="grid grid-cols-10 gap-2">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`text-xl p-1.5 rounded-md ${
                      formData.icon === emoji ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => handleInputChange("icon", emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="grid grid-cols-10 gap-2">
                {COLOR_LIST.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full ${
                      formData.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleInputChange("color", color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Fréquence</Label>
              <RadioGroup 
                value={formData.frequency} 
                onValueChange={(v) => handleInputChange("frequency", v as "daily" | "weekly")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Quotidienne</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Hebdomadaire</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="habit-active" 
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange("active", checked)}
              />
              <Label htmlFor="habit-active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewHabitDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddHabit}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de modification d'habitude */}
      <Dialog open={editHabitDialogOpen} onOpenChange={setEditHabitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'habitude</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-habit-name">Nom</Label>
              <Input 
                id="edit-habit-name" 
                placeholder="Ex: Boire 2L d'eau" 
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-habit-desc">Description (optionnelle)</Label>
              <Textarea 
                id="edit-habit-desc" 
                placeholder="Description de l'habitude" 
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="max-h-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Icône</Label>
              <div className="grid grid-cols-10 gap-2">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`text-xl p-1.5 rounded-md ${
                      formData.icon === emoji ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted'
                    }`}
                    onClick={() => handleInputChange("icon", emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Couleur</Label>
              <div className="grid grid-cols-10 gap-2">
                {COLOR_LIST.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full ${
                      formData.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleInputChange("color", color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Fréquence</Label>
              <RadioGroup 
                value={formData.frequency} 
                onValueChange={(v) => handleInputChange("frequency", v as "daily" | "weekly")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="edit-daily" />
                  <Label htmlFor="edit-daily">Quotidienne</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="edit-weekly" />
                  <Label htmlFor="edit-weekly">Hebdomadaire</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-habit-active" 
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange("active", checked)}
              />
              <Label htmlFor="edit-habit-active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditHabitDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditHabit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HabitsSettingsCard;


import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { useAuth, SubscriptionPlan } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("free");
  const [step, setStep] = useState<"plan" | "details">("plan");

  const handleContinue = () => {
    if (step === "plan") {
      setStep("details");
    } else {
      if (!email || !validateEmail(email)) {
        toast.error("Veuillez saisir une adresse email valide");
        return;
      }
      if (!password || password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
      
      login(email, password, selectedPlan);
      toast.success(`Compte créé avec succès ! Plan: ${selectedPlan === "premium" ? "Premium" : "Gratuit"}`);
      setStep("plan");
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const resetAndClose = () => {
    setStep("plan");
    setShowAuthModal(false);
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "plan" ? "Choisissez votre plan" : "Créez votre compte"}
          </DialogTitle>
          <DialogDescription>
            {step === "plan" 
              ? "Sélectionnez l'option qui vous convient le mieux"
              : "Renseignez vos informations pour continuer"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === "plan" ? (
            <div className="space-y-4">
              <div 
                className={`border p-4 rounded-md cursor-pointer ${
                  selectedPlan === "free" ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPlan("free")}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Plan Gratuit</h3>
                    <p className="text-sm text-muted-foreground">Fonctionnalités de base</p>
                  </div>
                  <div className="text-lg font-semibold">0 €</div>
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Suivi des calories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Statistiques de base</span>
                  </li>
                </ul>
              </div>

              <div 
                className={`border p-4 rounded-md cursor-pointer ${
                  selectedPlan === "premium" ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPlan("premium")}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Plan Premium</h3>
                    <p className="text-sm text-muted-foreground">Toutes les fonctionnalités</p>
                  </div>
                  <div className="text-lg font-semibold">3,99 € / mois</div>
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Toutes les fonctionnalités gratuites</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Saisie par IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Analyses avancées</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {step === "details" && (
            <Button variant="outline" onClick={() => setStep("plan")}>
              Retour
            </Button>
          )}
          <Button className={step === "plan" ? "w-full" : ""} onClick={handleContinue}>
            {step === "plan" ? "Continuer" : "Créer mon compte"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

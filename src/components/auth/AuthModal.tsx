
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthModal = () => {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("free");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"plan" | "details">("details");

  const handleContinue = () => {
    if (mode === "register" && step === "plan") {
      setStep("details");
      return;
    }
    
    if (!email || !validateEmail(email)) {
      toast.error("Veuillez saisir une adresse email valide");
      return;
    }
    
    if (!password || password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    login(email, password, mode === "register" ? selectedPlan : null);
    const successMessage = mode === "login" 
      ? "Connexion réussie !" 
      : `Compte créé avec succès ! Plan: ${selectedPlan === "premium" ? "Premium" : "Gratuit"}`;
    toast.success(successMessage);
    resetAndClose();
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const resetAndClose = () => {
    setStep("details");
    if (mode === "register") {
      setStep("plan");
    }
    setShowAuthModal(false);
  };

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setStep(newMode === "register" ? "plan" : "details");
  };

  const handleSignupClick = () => {
    setMode("register");
    setStep("plan");
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        {mode === "login" || (mode === "register" && step === "details") ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {mode === "login" ? "Connexion" : "Créez votre compte"}
              </DialogTitle>
              <DialogDescription>
                {mode === "login" 
                  ? "Connectez-vous à votre compte"
                  : "Renseignez vos informations pour continuer"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
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
              {mode === "login" && (
                <div className="text-sm">
                  <span>Pas encore de compte ? </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto" 
                    onClick={handleSignupClick}
                  >
                    S'inscrire
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              {mode === "register" && step === "details" && (
                <Button variant="outline" onClick={() => setStep("plan")}>
                  Retour
                </Button>
              )}
              <Button 
                className={mode === "login" ? "w-full" : ""} 
                onClick={handleContinue}
              >
                {mode === "login" ? "Se connecter" : "Créer mon compte"}
              </Button>
            </div>
          </>
        ) : (
          // Mode inscription - Étape du choix du plan
          <>
            <DialogHeader>
              <DialogTitle>Choisissez votre plan</DialogTitle>
              <DialogDescription>
                Sélectionnez l'option qui vous convient le mieux
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
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
              
              <div className="text-sm">
                <span>Déjà un compte ? </span>
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => handleModeChange("login")}
                >
                  Se connecter
                </Button>
              </div>
            </div>

            <Button className="w-full" onClick={() => setStep("details")}>
              Continuer
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

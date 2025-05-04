
import CalorieGoalCard from "@/components/settings/CalorieGoalCard";
import MacrosDistributionCard from "@/components/settings/MacrosDistributionCard";
import GeminiApiKeyForm from "@/components/settings/GeminiApiKeyForm";

const SettingsPage = () => {
  return (
    <div className="mobile-container pt-4 pb-20 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      
      <CalorieGoalCard />
      
      <MacrosDistributionCard />
      
      <GeminiApiKeyForm />
    </div>
  );
};

export default SettingsPage;

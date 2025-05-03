
import { useState, useEffect } from "react";
import { getAchievements, checkAndUpdateAchievements } from "@/utils/storage";
import { Achievement } from "@/types";
import AchievementCard from "@/components/achievements/AchievementCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(getAchievements());
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Filter achievements by category
  const filteredAchievements = activeFilter === "all"
    ? achievements
    : achievements.filter((a) => a.category === activeFilter);
  
  // Sort achievements: unlocked first, then by level (gold > silver > bronze)
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    // First by unlocked status
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    
    // Then by level if both have same unlock status
    const levelOrder = { gold: 3, silver: 2, bronze: 1 };
    return levelOrder[b.level] - levelOrder[a.level];
  });
  
  // Count unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  useEffect(() => {
    // Check if any new achievements have been unlocked
    checkAndUpdateAchievements();
    setAchievements(getAchievements());
  }, []);
  
  return (
    <div className="mobile-container pt-4 pb-20">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-1">Succès</h1>
        <p className="text-muted-foreground">
          {unlockedCount} sur {achievements.length} débloqués
        </p>
      </div>
      
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="consistency">Régularité</TabsTrigger>
          <TabsTrigger value="weight">Poids</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter} className="tab-content">
          <div className="space-y-3">
            {sortedAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
              />
            ))}
            
            {sortedAchievements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun succès dans cette catégorie</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementsPage;

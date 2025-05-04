
// Utilitaire pour gérer le stockage d'images dans localStorage

/**
 * Enregistre une image dans le localStorage
 * @param file Fichier image à enregistrer
 * @returns Clé pour récupérer l'image ultérieurement
 */
export const saveImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        const filename = `image-${Date.now()}.${file.name.split('.').pop()}`;
        
        // Stocker l'image en base64 dans localStorage
        localStorage.setItem(`nutrition-tracker-image-${filename}`, base64String);
        
        // Retourner le nom du fichier comme identifiant
        resolve(filename);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Récupère une image depuis le localStorage
 * @param key Clé de l'image à récupérer
 * @returns L'image en base64 ou null si non trouvée
 */
export const getImageUrl = (key: string): string | null => {
  return localStorage.getItem(`nutrition-tracker-image-${key}`);
};

/**
 * Supprime une image du localStorage
 * @param key Clé de l'image à supprimer
 */
export const deleteImage = (key: string): void => {
  localStorage.removeItem(`nutrition-tracker-image-${key}`);
};

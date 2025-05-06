
// Préfixe pour les clés d'images dans le localStorage
const IMAGE_PREFIX = "nutrition-tracker-image-";

/**
 * Convertit une image en chaîne Base64 et la stocke dans le localStorage
 * @param file Le fichier image à stocker
 * @param name Le nom sous lequel l'image sera stockée (optional)
 * @returns Promise qui résout le nom de l'image stockée
 */
export const storeImage = (file: File, name: string = Date.now().toString()): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      try {
        if (typeof reader.result === "string") {
          const imageKey = `${IMAGE_PREFIX}${name}`;
          localStorage.setItem(imageKey, reader.result);
          resolve(name);
        } else {
          reject(new Error("Conversion de l'image en base64 échouée"));
        }
      } catch (error) {
        console.error("Erreur lors du stockage de l'image:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Erreur lors de la lecture du fichier"));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Récupère une image stockée dans le localStorage
 * @param name Le nom de l'image à récupérer
 * @returns L'URL de l'image ou null si non trouvée
 */
export const getImageUrl = (name: string): string | null => {
  const imageKey = `${IMAGE_PREFIX}${name}`;
  const imageData = localStorage.getItem(imageKey);
  return imageData;
};

/**
 * Supprime une image du localStorage
 * @param name Le nom de l'image à supprimer
 * @returns true si supprimé avec succès, false sinon
 */
export const removeImage = (name: string): boolean => {
  const imageKey = `${IMAGE_PREFIX}${name}`;
  
  if (localStorage.getItem(imageKey)) {
    localStorage.removeItem(imageKey);
    return true;
  }
  
  return false;
};

/**
 * Sauvegarde une image et retourne son identifiant
 * @param file Le fichier image à sauvegarder
 * @returns Promise résolvant l'identifiant de l'image
 */
export const saveImage = async (file: File): Promise<string> => {
  const imageId = `img_${Date.now()}`;
  await storeImage(file, imageId);
  return imageId;
};

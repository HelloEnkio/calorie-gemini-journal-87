
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

/**
 * Génère une image factice colorée
 * @param width Largeur de l'image
 * @param height Hauteur de l'image
 * @param color Couleur de fond (code hexadécimal)
 * @param text Texte à afficher sur l'image
 * @returns Image en base64
 */
export const createColoredImageBase64 = (width: number, height: number, color: string, text: string): string => {
  // Créer un canvas pour générer l'image
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Remplir le fond
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Ajouter du texte
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width/2, height/2);

    // Ajouter une silhouette simple
    const centerX = width / 2;
    const startY = height * 0.3;
    const bodyWidth = width * 0.2;
    const bodyHeight = height * 0.4;

    // Tête
    ctx.beginPath();
    ctx.arc(centerX, startY, width * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();

    // Corps
    ctx.fillRect(centerX - bodyWidth/2, startY + width * 0.08, bodyWidth, bodyHeight);
  }
  
  return canvas.toDataURL('image/png');
};

/**
 * Génère une collection d'images factices pour la démo
 */
export const createMockWeightImages = () => {
  console.log("Generating mock weight images...");
  // Définir des couleurs différentes pour chaque étape
  const colors = [
    "#3b82f6", // Bleu (aujourd'hui)
    "#10b981", // Vert (- 7j)
    "#f59e0b", // Orange (- 14j)
    "#8b5cf6", // Violet (- 21j)
    "#ec4899", // Rose (- 28j)
    "#6366f1", // Indigo (- 35j)
    "#ef4444", // Rouge (- 42j)
    "#14b8a6", // Teal (- 49j)
    "#f97316", // Orange foncé (- 56j)
  ];
  
  // Créer des images pour plusieurs jours
  const days = [0, 7, 14, 21, 28, 35, 42, 49, 56];
  const mockImages: Record<string, string> = {};
  
  days.forEach((day, index) => {
    const color = colors[index % colors.length];
    const label = day === 0 ? "Aujourd'hui" : `Il y a ${day} jours`;
    
    mockImages[`weight-photo-day-${day}.png`] = createColoredImageBase64(300, 400, color, label);
  });
  
  // Enregistrer toutes les images dans le localStorage
  for (const [key, value] of Object.entries(mockImages)) {
    localStorage.setItem(`nutrition-tracker-image-${key}`, value);
  }
  
  console.log(`Created ${days.length} mock weight images`);
  return mockImages;
};


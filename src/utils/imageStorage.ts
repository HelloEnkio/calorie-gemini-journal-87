
/**
 * Utility functions for handling image storage
 */

// Save image to local storage and return the URL
export const saveImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) {
          reject(new Error("Failed to read file"));
          return;
        }
        
        const imageData = e.target.result as string;
        
        // Générer un ID unique pour l'image
        const imageId = `weight-photo-${Date.now()}`;
        
        // Stocker l'image dans localStorage
        const storedImages = JSON.parse(localStorage.getItem('nutrition-tracker-weight-photos') || '{}');
        storedImages[imageId] = imageData;
        localStorage.setItem('nutrition-tracker-weight-photos', JSON.stringify(storedImages));
        
        resolve(imageId);
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

// Get image URL from local storage
export const getImageUrl = (imageId: string): string | null => {
  try {
    const storedImages = JSON.parse(localStorage.getItem('nutrition-tracker-weight-photos') || '{}');
    return storedImages[imageId] || null;
  } catch (error) {
    console.error('Error retrieving image:', error);
    return null;
  }
};

// Get all weight photos
export const getAllWeightPhotos = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem('nutrition-tracker-weight-photos') || '{}');
  } catch (error) {
    console.error('Error retrieving all images:', error);
    return {};
  }
};

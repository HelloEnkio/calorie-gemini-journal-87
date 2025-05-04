
/**
 * Utility functions for handling image storage
 */

// Default mock weight photos for demonstration
const mockWeightPhotos = {
  'weight-photo-1682870400000': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+UGhvdG8gMSAtIDI3L0F2cmlsLzIwMjM8L3RleHQ+PC9zdmc+',
  'weight-photo-1685548800000': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NlNWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+UGhvdG8gMiAtIDMxL01haS8yMDIzPC90ZXh0Pjwvc3ZnPg==',
  'weight-photo-1688140800000': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYzVlOGM1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+UGhvdG8gMyAtIDMwL0p1aW4vMjAyMzwvdGV4dD48L3N2Zz4=',
  'weight-photo-1690819200000': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZkOGMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+UGhvdG8gNCAtIDMxL0p1aWxsZXQvMjAyMzwvdGV4dD48L3N2Zz4=',
  'weight-photo-1693497600000': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhjY2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+UGhvdG8gNSAtIDMxL0FvdXQvMjAyMzwvdGV4dD48L3N2Zz4=',
  'weight-photo-1696089600000': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZlMGIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+UGhvdG8gNiAtIDMwL1NlcHRlbWJyZS8yMDIzPC90ZXh0Pjwvc3ZnPg==',
  'weight-photo-1698768000000': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWFlYWZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+UGhvdG8gNyAtIDMxL09jdG9icmUvMjAyMzwvdGV4dD48L3N2Zz4=',
  'weight-photo-1701360000000': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDllZGQ5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzMzMzMzMyI+UGhvdG8gOCAtIDMwL05vdmVtYnJlLzIwMjM8L3RleHQ+PC9zdmc+',
};

// Initialize mock photos in localStorage
const initMockWeightPhotos = () => {
  const storedPhotos = localStorage.getItem('nutrition-tracker-weight-photos');
  if (!storedPhotos || JSON.parse(storedPhotos) === '{}' || Object.keys(JSON.parse(storedPhotos)).length === 0) {
    localStorage.setItem('nutrition-tracker-weight-photos', JSON.stringify(mockWeightPhotos));
    console.log('Mock weight photos initialized');
  }
};

// Call this function when the app starts
initMockWeightPhotos();

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


// Add or ensure the saveImage function is exported
export const saveImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Generate a unique key for the image
        const key = `nutrition-tracker-image-${file.name}-${Date.now()}`;
        
        // Save image data to localStorage
        localStorage.setItem(key, reader.result as string);
        
        // Return the key as the image URL
        resolve(key);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

// Function to get the URL of a stored image
export const getImageUrl = (key: string): string => {
  return localStorage.getItem(key) || "";
};

// imageCompression.js
export const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      // Early exit if file is not an image
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }
  
      // Calculate optimal settings based on file size
      const sizeMB = file.size / 1024 / 1024;
      let quality, maxDimension;
      
      if (sizeMB <= 1) {
        quality = 0.8;
        maxDimension = 1600;
      } else if (sizeMB <= 3) {
        quality = 0.75;
        maxDimension = 1800;
      } else {
        quality = 0.7;
        maxDimension = 2000;
      }
  
      // For documents/text-heavy images, adjust quality to be slightly higher
      if (sizeMB < 2) {
        quality += 0.1; // Increase quality for smaller files to preserve text
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height *= maxDimension / width;
              width = maxDimension;
            } else {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }
  
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
  
          // Enable better text quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
  
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create new file from blob
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
  
            // Only use compressed version if it's actually smaller
            const finalFile = compressedFile.size < file.size ? compressedFile : file;
  
            // Log compression results
            const compressionRatio = (finalFile.size / file.size * 100).toFixed(2);
            console.log('Compression results:', {
              originalSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
              compressedSize: `${(finalFile.size / 1024 / 1024).toFixed(2)}MB`,
              ratio: `${compressionRatio}%`,
              quality,
              maxDimension
            });
  
            resolve(finalFile);
          }, file.type, quality);
        };
  
        img.onerror = (error) => {
          reject(error);
        };
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
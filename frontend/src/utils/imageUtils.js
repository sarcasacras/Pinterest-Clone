export const resizeImage = (file, maxWidth = 1200, maxHeight = 1800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      const newWidth = Math.round(img.width * ratio);
      const newHeight = Math.round(img.height * ratio);
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob((blob) => {
        const resizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        resolve(resizedFile);
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
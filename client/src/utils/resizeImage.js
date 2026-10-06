export async function resizeImage(file, maxSize = 2048, quality = 0.88) {
  return new Promise((resolve, reject) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const blob = new Blob([e.target.result], { type: file.type });
        
        // Handle EXIF orientation automatically using createImageBitmap
        const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
        
        const width = bitmap.width;
        const height = bitmap.height;

        let newWidth = width;
        let newHeight = height;

        // Calculate aspect ratio
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            newWidth = maxSize;
            newHeight = Math.round((height * maxSize) / width);
          } else {
            newHeight = maxSize;
            newWidth = Math.round((width * maxSize) / height);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);

        // Keep PNG as PNG if we want to preserve transparency, otherwise JPEG
        const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const outQuality = outType === 'image/jpeg' ? quality : undefined;
        
        const dataUrl = canvas.toDataURL(outType, outQuality);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

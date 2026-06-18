import { useState, useEffect } from 'react';

// Lädt ein Bild per URL und gibt das HTMLImageElement zurück, sobald es geladen ist.
// Gibt null zurück, solange das Bild noch lädt.
export function useImage(url) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!url) return;
    setImage(null);
    const img = new window.Image();
    img.onload = () => setImage(img);
    img.src = url;
    return () => {
      img.onload = null;
    };
  }, [url]);

  return image;
}

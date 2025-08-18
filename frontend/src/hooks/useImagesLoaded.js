import { useState, useEffect } from "react";

export const useImagesLoaded = (pins) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (!pins || pins.length === 0) {
      setImagesLoaded(true);
      return;
    }

    setImagesLoaded(false);
    setLoadedCount(0);

    const timer = setTimeout(() => {
      const images = document.querySelectorAll(".galleryImg");
      const totalImages = images.length;

      if (totalImages === 0) {
        setImagesLoaded(true);
        return;
      }

      let loaded = 0;

      const handleImageLoad = () => {
        loaded++;
        setLoadedCount(loaded);

        if (loaded === totalImages) {
          setImagesLoaded(true);
        }
      };

      const handleImageError = () => {
        loaded++;
        setLoadedCount(loaded);

        if (loaded === totalImages) {
          setImagesLoaded(true);
        }
      };

      images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
          handleImageLoad();
        } else {
          img.addEventListener("load", handleImageLoad);
          img.addEventListener("error", handleImageError);
        }
      });

      return () => {
        images.forEach((img) => {
          img.removeEventListener("load", handleImageLoad);
          img.removeEventListener("error", handleImageError);
        });
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [pins.length]);

  return { imagesLoaded, loadedCount, totalImages: pins?.length || 0 };
};

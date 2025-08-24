import { Image } from "@imagekit/react";
import { useState } from "react";

export default function Img({ src, alt, className, w, originalWidth, originalHeight, ...rest}) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const targetWidth = w || 600;
  const calculatedHeight = originalWidth && originalHeight 
    ? Math.round(targetWidth * (originalHeight / originalWidth))
    : undefined;

  if (hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        {...rest}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      loading="lazy"
      transformation={[{ 
        width: targetWidth, 
        height: calculatedHeight,
        format: "auto", 
        quality: "auto" 
      }]}
      lqip={{ active: true, quality: 20 }}
      onError={handleError}
      {...rest}
    />
  );
}

import { Image } from "@imagekit/react";

export default function Img({ src, alt, className, w, ...rest}) {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      loading="lazy"
      transformation={[{ width: w || 600, format: "auto", quality: "auto" }]}
      lqip={{ active: true, quality: 20 }}
      {...rest}
    />
  );
}

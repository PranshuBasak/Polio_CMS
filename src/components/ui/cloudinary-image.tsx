"use client";

import { CldImage, CldImageProps } from "next-cloudinary";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type CloudinaryImageProps = Omit<CldImageProps, "src"> & {
  src?: string;
  alt: string;
  fallbackSrc?: string;
};

export default function CloudinaryImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  ...props
}: CloudinaryImageProps) {
  const [error, setError] = useState(false);
  const imageProps = props as Partial<ImageProps> & { className?: string };
  const hasExplicitSize = Boolean(
    imageProps.fill ||
      (typeof imageProps.width === "number" && typeof imageProps.height === "number")
  );

  if (!src || error) {
    // If no explicit dimensions are provided, use a native img to avoid Next/Image runtime errors.
    if (!hasExplicitSize) {
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={imageProps.className}
          style={imageProps.style}
          loading={imageProps.loading}
        />
      );
    }

    // Fallback to standard Next.js Image for placeholders when dimensions are provided.
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        {...(props as any)}
        unoptimized // placeholders might be SVGs or local files
      />
    );
  }

  // Check if it's a Cloudinary URL
  const isCloudinary = src.includes("res.cloudinary.com");

  // If dimensions are not provided, render native img for any remote source (Cloudinary or not).
  if (!hasExplicitSize) {
    return (
      <img
        src={src}
        alt={alt}
        className={imageProps.className}
        style={imageProps.style}
        loading={imageProps.loading}
        onError={() => setError(true)}
      />
    );
  }

  if (isCloudinary) {
    return (
        <CldImage
          src={src}
          alt={alt}
          onError={() => setError(true)}
          {...props}
        />
    );
  }

  // Fallback for non-Cloudinary images when explicit dimensions are provided.
  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setError(true)}
      {...(props as any)}
    />
  );
}

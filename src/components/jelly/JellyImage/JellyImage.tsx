import Image from "next/image";

export type StaticJellyPose = "mir-eyebrow_raised" | "surprised" | "eyes_closed";

type JellyImageProps = {
  pose: StaticJellyPose;
  alt: string;
  className?: string;
};

export function JellyImage({ pose, alt, className }: JellyImageProps) {
  return (
    <Image
      src={`/jelly/jelly-${pose}.svg`}
      alt={alt}
      width={1880}
      height={1570}
      className={className}
    />
  );
}

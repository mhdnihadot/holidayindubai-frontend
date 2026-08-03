import { memo } from "react";

interface SlideImageProps {
  image: any;
  imageClassName?: string;
}

const SlideImage = memo(({ image, imageClassName = "" }: SlideImageProps) => (
  <div className="absolute top-0 left-0 h-full w-full overflow-hidden sm:overflow-visible">
    {/* Mobile Image */}
    <div className="relative h-full w-full p-0 md:hidden">
      <div className="relative h-full w-full">
        <img
          alt={image.name || image.title || "ads image"}
          src={
            typeof image?.mobileImage === "object"
              ? image?.mobileImage?.webp?.url || image?.mobileImage?.url
              : image?.mobileImage || image?.websiteImage || ""
          }
          className={`absolute inset-0 h-full w-full object-cover rounded-[3px] ${imageClassName}`}
        />
      </div>
    </div>

    {/* Desktop Image */}
    <img
      alt={image.name || image.title || "ads image"}
      src={
        typeof image?.desktopImage === "object"
          ? image?.desktopImage?.webp?.url || image?.desktopImage?.url
          : image?.desktopImage || image?.websiteImage || image?.mobileImage || ""
      }
      className={`absolute inset-0 hidden h-full w-full object-cover md:block ${imageClassName}`}
    />
  </div>
));

SlideImage.displayName = "SlideImage";

export default SlideImage;

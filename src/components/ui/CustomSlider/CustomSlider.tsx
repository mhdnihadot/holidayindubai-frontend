/**
 * CustomSlider Component
 * Displays a rotating banner of images with animations
 * Optimized with React.memo and useCallback
 */

import { memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { CustomSliderProps } from "./types";
import { useCustomSlider } from "./useCustomSlider";
import SlideImage from "./SlideImage";

const CustomSliderComponent = (props: CustomSliderProps) => {
  const { images, containerClassName = "", imageClassName = "", heightClassName = "" } = props;

  const { currentIndex, currentImage, handleClick } = useCustomSlider(props);

  if (!images || images.length === 0 || !currentImage) return null;

  const destination = currentImage?.projectDetails?.slug
    ? `/projects/${currentImage.projectDetails.slug}`
    : currentImage?.project
    ? typeof currentImage.project === "object"
      ? `/projects/${currentImage.project.id || currentImage.project._id}`
      : `/projects/${currentImage.project}`
    : "#";

  const isExternalUrl = !!currentImage?.url;
  const Wrapper = isExternalUrl ? "a" : Link;
  const wrapperProps: any = isExternalUrl
    ? {
        href: currentImage.url,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {
        to: destination,
        onClick: (e: any) => {
          if (destination === "#") e.preventDefault();
          handleClick(currentImage._id || currentImage.id);
        },
      };

  return (
    <Wrapper
      {...wrapperProps}
      className={`relative flex w-full overflow-hidden ${containerClassName}`}
    >
      <div className={`relative w-full ${heightClassName || "h-[120px] sm:h-[550px]"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="absolute inset-0 h-full w-full"
          >
            <SlideImage image={currentImage} imageClassName={imageClassName} />
          </motion.div>
        </AnimatePresence>
      </div>
    </Wrapper>
  );
};

// ⚡ Export memoized component
export default memo(CustomSliderComponent);

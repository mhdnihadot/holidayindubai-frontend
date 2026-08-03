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

  return (
    <Link
      onClick={(e) => {
        if (destination === "#") e.preventDefault();
        handleClick(currentImage._id || currentImage.id);
      }}
      to={destination}
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
    </Link>
  );
};

// ⚡ Export memoized component
export default memo(CustomSliderComponent);

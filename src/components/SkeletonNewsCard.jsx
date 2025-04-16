import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SkeletonNewsCard = ({ isFeature = false, variant = "regular" }) => {
  // Configuration based on variant
  const getCardLayout = () => {
    switch (variant) {
      case "large":
      case "hero":
        return "flex flex-col md:flex-row";
      case "horizontal":
        return "flex flex-col md:flex-row";
      default:
        return "flex flex-col";
    }
  };

  const getImageContainerClass = () => {
    switch (variant) {
      case "large":
      case "hero":
        return "w-full md:w-2/3 h-56 md:h-[400px]";
      case "horizontal":
        return "w-full md:w-1/3 h-40 md:h-auto";
      case "small":
        return "w-full h-32";
      default:
        return "w-full h-48";
    }
  };

  const getContentContainerClass = () => {
    switch (variant) {
      case "large":
      case "hero":
        return "p-5 md:p-6 w-full md:w-1/3";
      case "horizontal":
        return "p-4 md:p-5 w-full md:w-2/3";
      case "small":
        return "p-3";
      default:
        return "p-4";
    }
  };

  const getTitleClass = () => {
    switch (variant) {
      case "large":
      case "hero":
        return "h-7 md:h-8 w-5/6";
      case "small":
        return "h-5 w-3/4";
      default:
        return "h-6 w-4/5";
    }
  };

  return (
    <div className={`h-full rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${getCardLayout()}`}>
      <div className={`${getImageContainerClass()} bg-gray-200 dark:bg-gray-700 animate-pulse`}></div>

      <div className={`flex flex-col flex-grow ${getContentContainerClass()}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/6"></div>
        </div>

        <div className={`${getTitleClass()} bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3`}></div>

        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
          {variant !== "small" && <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5"></div>}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

SkeletonNewsCard.propTypes = {
  isFeature: PropTypes.bool,
  variant: PropTypes.oneOf(["hero", "large", "horizontal", "regular", "small"]),
};

export default SkeletonNewsCard;

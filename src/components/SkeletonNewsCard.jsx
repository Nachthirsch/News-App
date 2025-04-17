import PropTypes from "prop-types";

const SkeletonNewsCard = ({ variant = "regular", isFeature = false }) => {
  // Determine image height based on variant
  const getImageHeight = () => {
    if (variant === "hero" || isFeature) return "h-64 md:h-72";
    if (variant === "text-only" || variant === "title-only") return "hidden";
    if (variant === "thumbnail-square") return "h-full aspect-square";
    if (variant === "horizontal") return "h-48";
    return "h-48";
  };

  // Determine content container class based on variant
  const getContentClass = () => {
    if (variant === "hero" || isFeature) return "p-5";
    if (variant === "text-only") return "p-5 h-full";
    if (variant === "title-only") return "p-4";
    if (variant === "thumbnail-square") return "p-3";
    return "p-4";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-full border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Image skeleton - hide for text-only */}
      {variant !== "text-only" && variant !== "title-only" && <div className={`bg-gray-200 dark:bg-gray-700 ${getImageHeight()}`}></div>}

      {/* Content skeleton */}
      <div className={getContentClass()}>
        {/* Source badge */}
        {(variant === "text-only" || variant === "title-only" || !(variant === "hero" || isFeature)) && (
          <div className="flex items-center justify-between mb-3">
            <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            {variant !== "thumbnail-square" && (
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <div className={`${variant === "hero" || isFeature ? "h-8 mb-4" : "h-6 mb-3"} bg-gray-200 dark:bg-gray-700 rounded-md`}></div>
        {variant === "hero" && <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>}

        {/* Description - hide for title-only and thumbnail-square */}
        {variant !== "title-only" && variant !== "thumbnail-square" && (
          <>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
            {(variant === "hero" || isFeature) && <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-2"></div>}
          </>
        )}

        {/* Footer - hide for title-only and thumbnail-square */}
        {variant !== "title-only" && variant !== "thumbnail-square" && (
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-gray-700">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        )}
      </div>
    </div>
  );
};

SkeletonNewsCard.propTypes = {
  variant: PropTypes.oneOf(["hero", "feature", "horizontal", "regular", "small", "text-only", "title-only", "thumbnail-square"]),
  isFeature: PropTypes.bool,
};

export default SkeletonNewsCard;

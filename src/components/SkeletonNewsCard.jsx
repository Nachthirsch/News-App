import React from "react";

const SkeletonNewsCard = ({ variant = "regular" }) => {
  // Configuration based on variant
  const getSkeletonLayout = () => {
    switch (variant) {
      case "hero":
        return "pb-6 mb-6 border-b border-gray-100 dark:border-gray-800";
      case "feature":
        return "pb-6 mb-6 border-b border-gray-100 dark:border-gray-800";
      case "horizontal":
        return "pb-4 mb-4 border-b border-gray-100 dark:border-gray-800";
      case "text-only":
        return "pb-4 mb-4 border-b border-gray-100 dark:border-gray-800";
      case "title-only":
        return "pb-3 mb-3 border-b border-gray-100 dark:border-gray-800";
      case "thumbnail-square":
        return "h-full"; // No border for thumbnail cards
      default:
        return "pb-4 mb-4 border-b border-gray-100 dark:border-gray-800";
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case "hero":
        return "h-64 md:h-[400px]";
      case "feature":
        return "h-48 md:h-56";
      case "horizontal":
        return "h-48";
      case "small":
        return "h-32";
      case "thumbnail-square":
        return "aspect-square h-[120px]";
      default:
        return "h-48";
    }
  };

  return (
    <div className={`flex flex-col animate-pulse ${getSkeletonLayout()}`}>
      {/* Skip image for text-only and title-only variants */}
      {variant !== "text-only" && variant !== "title-only" && <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 ${getImageHeight()}`}></div>}

      {/* Source indicator */}
      {variant !== "thumbnail-square" && (
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      )}

      {/* Title */}
      <div className={`h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 ${variant === "hero" ? "w-3/4" : variant === "feature" ? "w-2/3" : variant === "thumbnail-square" ? "w-full h-4" : "w-full"}`}></div>

      {variant === "hero" && <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>}

      {/* Description - not for title-only and thumbnail-square */}
      {variant !== "title-only" && variant !== "thumbnail-square" && (
        <>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-5/6"></div>
          {(variant === "hero" || variant === "feature") && <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-4/6"></div>}
        </>
      )}

      {/* Footer */}
      {variant !== "title-only" && variant !== "thumbnail-square" && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      )}
    </div>
  );
};

export default SkeletonNewsCard;

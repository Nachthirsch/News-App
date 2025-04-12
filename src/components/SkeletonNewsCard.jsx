import { motion } from "framer-motion";

const SkeletonNewsCard = () => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm
                 border border-gray-200 dark:border-gray-700
                 flex flex-col h-full overflow-hidden"
    >
      {/* Image skeleton */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />

      <div className="flex flex-col flex-grow p-4 gap-3">
        {/* Source tag skeleton */}
        <div className="flex items-center justify-between">
          <motion.div className="w-24 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="w-5/6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

        {/* Description skeleton */}
        <div className="space-y-2 mt-2 flex-grow">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-end pt-3 mt-auto border-t border-gray-100 dark:border-gray-700">
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonNewsCard;

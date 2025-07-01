import NewsCard from "./NewsCard";
import SkeletonNewsCard from "./SkeletonNewsCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const NewsGrid = ({ news, onSave, savedNews, isLoading = false }) => {
  const [mounted, setMounted] = useState(false);
  const [layoutType, setLayoutType] = useState("mobile-grid"); // Changed default to "mobile-grid"
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    setMounted(true);

    // Add window resize listener to adjust layout based on screen size
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-switch to featured layout on larger screens
      if (window.innerWidth >= 768) {
        setLayoutType("featured");
      } else {
        setLayoutType("mobile-grid");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fungsi helper untuk mendapatkan URL gambar dari item berita
  const getImageUrl = (item, preferThumbnail = false) => {
    // Check if we should prefer thumbnail for smaller card layouts
    if (preferThumbnail) {
      // First check for thumbnail in the new API format
      if (item.multimedia && typeof item.multimedia === "object" && !Array.isArray(item.multimedia)) {
        if (item.multimedia.thumbnail && item.multimedia.thumbnail.url) {
          return item.multimedia.thumbnail.url;
        }
      }

      // Then check for thumbnail in array format
      if (Array.isArray(item.multimedia) && item.multimedia.length > 0) {
        const thumbStandard = item.multimedia.find((m) => m.format === "Standard Thumbnail" || m.format === "thumbStandard");
        if (thumbStandard) {
          return item.isTimeswire ? thumbStandard.url : `https://www.nytimes.com/${thumbStandard.url}`;
        }
      }
    }

    // Check for direct image URL from TimeWire
    if (item.image_url) {
      return item.image_url;
    }

    // Check for images object structure from TimeWire
    if (item.images) {
      // Prioritize images by size (large to small)
      return item.images.large || item.images.medium || item.images.inline || item.images.small;
    }

    // Check for thumbnail_standard (common in TimeWire)
    if (item.thumbnail_standard) {
      return item.thumbnail_standard;
    }

    // Jika multimedia adalah objek dengan properti default (format API baru yang benar)
    if (item.multimedia && typeof item.multimedia === "object" && !Array.isArray(item.multimedia)) {
      // Gunakan URL dari default (ukuran besar) jika ada
      if (item.multimedia.default && item.multimedia.default.url) {
        return item.multimedia.default.url; // URL sudah lengkap, tidak perlu tambahkan domain
      }
      // Atau gunakan thumbnail jika default tidak ada
      if (item.multimedia.thumbnail && item.multimedia.thumbnail.url) {
        return item.multimedia.thumbnail.url; // URL sudah lengkap, tidak perlu tambahkan domain
      }
    }

    // Jika multimedia adalah array (format API lama atau TimeWire)
    if (Array.isArray(item.multimedia) && item.multimedia.length > 0) {
      // TimeWire items already contain complete URLs
      if (item.isTimeswire) {
        // Find the best image format from TimeWire (prefer larger images)
        const mediumThreeByTwo440 = item.multimedia.find((m) => m.format === "mediumThreeByTwo440");
        const mediumThreeByTwo210 = item.multimedia.find((m) => m.format === "mediumThreeByTwo210");
        const normalImage = item.multimedia.find((m) => m.format === "Normal" || m.format === "articleInline");
        const thumbnailStandard = item.multimedia.find((m) => m.format === "Standard Thumbnail");

        // Return the best available image
        if (mediumThreeByTwo440) return mediumThreeByTwo440.url;
        if (mediumThreeByTwo210) return mediumThreeByTwo210.url;
        if (normalImage) return normalImage.url;
        if (thumbnailStandard) return thumbnailStandard.url;

        // If no specific format found, use the first available
        return item.multimedia[0].url;
      }

      // ArticleSearch URLs need domain prefix
      return `https://www.nytimes.com/${item.multimedia[0].url}`;
    }

    // Fallback ke placeholder
    return `https://placehold.co/600x400?text=${encodeURIComponent(item.headline?.main || "News")}`;
  };

  // Fungsi helper untuk mendapatkan source dari item berita
  const getSource = (item) => {
    // Format API baru menggunakan source.vernacular
    if (item.source && typeof item.source === "object" && item.source.vernacular) {
      return item.source.vernacular;
    }
    // Format API lama menggunakan string source
    if (typeof item.source === "string") {
      return item.source;
    }
    // Fallback
    return "The New York Times";
  };

  // Configure container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Create an array of skeleton cards when loading
  const renderSkeletonCards = () => {
    if (layoutType === "featured") {
      return Array(8)
        .fill()
        .map((_, index) => {
          let skeletonClass = "";

          if (index === 0) {
            skeletonClass = "col-span-3 row-span-2"; // Main article
          } else if (index === 1) {
            skeletonClass = "col-span-3 col-start-4"; // Top right
          } else if (index === 2) {
            skeletonClass = "col-span-3 col-start-4 row-start-2"; // Middle right
          } else if (index === 3) {
            skeletonClass = "col-span-3 col-start-4 row-start-3"; // Bottom right
          } else if (index === 4) {
            skeletonClass = "col-span-3 col-start-1 row-start-3"; // Third row left
          } else {
            skeletonClass = "col-span-2 row-span-2 row-start-4"; // Bottom row items
            if (index === 6) skeletonClass += " col-start-3"; // Bottom middle
            if (index === 7) skeletonClass += " col-start-5"; // Bottom right
          }

          return (
            <motion.div key={`skeleton-${index}`} variants={cardVariants} className={`h-full ${skeletonClass}`}>
              <SkeletonNewsCard isFeature={index === 0} variant={index >= 1 && index <= 4 ? "text-only" : "regular"} />
            </motion.div>
          );
        });
    }

    // Default skeleton rendering for other layouts
    return Array(6)
      .fill()
      .map((_, index) => {
        // Define skeleton card sizes based on position
        let skeletonClass = "";

        if (layoutType === "magazine") {
          if (index === 0) {
            skeletonClass = "col-span-full md:col-span-4 md:row-span-2 lg:col-span-4 lg:row-span-2";
          } else if (index === 1) {
            skeletonClass = "col-span-1 md:col-span-2 lg:col-span-2";
          } else if (index === 2) {
            skeletonClass = "col-span-1 md:col-span-2 lg:col-span-2";
          } else {
            skeletonClass = "col-span-1 md:col-span-2 lg:col-span-2";
          }
        }

        return (
          <motion.div key={`skeleton-${index}`} variants={cardVariants} className={`h-full ${skeletonClass}`}>
            <SkeletonNewsCard isFeature={index === 0 && layoutType === "magazine"} variant={index < 3 ? "large" : "small"} />
          </motion.div>
        );
      });
  };

  // Determine if we have enough news items for a good layout
  const hasEnoughItems = news.length >= 5;

  // Magazine layout grid configuration
  const getMagazineGridClass = () => {
    return "grid-cols-1 md:grid-cols-6 lg:grid-cols-6 md:grid-rows-[minmax(400px,auto)_auto_auto]";
  };

  // Classic layout grid configuration
  const getClassicGridClass = () => {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  // Get current grid class based on layout type
  const getGridClass = () => {
    if (layoutType === "mobile-grid") {
      return "grid-cols-5 grid-rows-auto gap-4";
    }

    // Default to featured layout otherwise
    return "grid-cols-6 grid-rows-auto";
  };

  // Get article size/position class for magazine layout
  const getMagazineItemClass = (index) => {
    if (index === 0) {
      // Main headline - spans full width on mobile, 4 columns on larger screens
      return "col-span-full md:col-span-4 md:row-span-1 lg:col-span-4 lg:row-span-1";
    } else if (index === 1) {
      // Featured sub-headline 1
      return "col-span-full md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
    } else if (index === 2) {
      // Featured sub-headline 2 - positioned right side
      return "col-span-full md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
    } else if (index === 3) {
      // Horizontal feature below main headline
      return "col-span-full md:col-span-3 lg:col-span-3";
    } else if (index === 4) {
      // Small feature 1
      return "col-span-1 md:col-span-3 lg:col-span-3";
    } else if (index % 3 === 0) {
      // Every third item after index 4 gets full width on mobile, half width on desktop
      return "col-span-full md:col-span-3 lg:col-span-3";
    } else {
      // Regular items
      return "col-span-full md:col-span-3 lg:col-span-3";
    }
  };

  // Get article position class for mobile grid layout
  const getMobileGridItemClass = (index) => {
    const position = index % 10; // Repeating pattern every 10 items

    switch (position) {
      case 0: // Card 1 - Full width with image+title+desc
        return "col-span-5 row-span-2";
      case 1: // Card 2 - Full width with title+desc
        return "col-span-5 row-span-2";
      case 2: // Card 3 - Full width with just title
        return "col-span-5";
      case 3: // Card 4 - Full width with just title
        return "col-span-5";
      case 9: // Card 10 - Full width with image+title+desc
        return "col-span-5 row-span-2";
      default:
        return ""; // Cards 5-9 will be handled separately in a horizontal scroll container
    }
  };

  // Get article position class for featured layout
  const getFeaturedItemClass = (index) => {
    // First 8 items follow the predefined layout
    if (index < 8) {
      switch (index) {
        case 0:
          return "col-span-3 row-span-2"; // Main article (top left)
        case 1:
          return "col-span-3 col-start-4"; // Top right
        case 2:
          return "col-span-3 col-start-4 row-start-2"; // Middle right
        case 3:
          return "col-span-3 col-start-4 row-start-3"; // Third row right
        case 4:
          return "col-span-3 col-start-1 row-start-3"; // Third row left
        case 5:
          return "col-span-2 row-span-2 row-start-4"; // Bottom left
        case 6:
          return "col-span-2 row-span-2 col-start-3 row-start-4"; // Bottom middle
        case 7:
          return "col-span-2 row-span-2 col-start-5 row-start-4"; // Bottom right
        default:
          return "";
      }
    } else {
      // For additional items (after load more), follow the bottom row pattern
      // Calculate position in the new rows
      const position = (index - 8) % 3;
      const rowOffset = Math.floor((index - 8) / 3) * 2;

      // Assign a layout similar to items 5, 6, 7 but in new rows
      switch (position) {
        case 0:
          return `col-span-2 row-span-2 row-start-${6 + rowOffset}`; // Like item 5 but in new row
        case 1:
          return `col-span-2 row-span-2 col-start-3 row-start-${6 + rowOffset}`; // Like item 6 but in new row
        case 2:
          return `col-span-2 row-span-2 col-start-5 row-start-${6 + rowOffset}`; // Like item 7 but in new row
        default:
          return "";
      }
    }
  };

  // Get article class based on layout type and index
  const getItemClass = (index) => {
    if (layoutType === "mobile-grid") {
      return getMobileGridItemClass(index);
    }

    if (layoutType === "featured") {
      return getFeaturedItemClass(index);
    }

    if (!hasEnoughItems) return "";

    switch (layoutType) {
      case "magazine":
        return getMagazineItemClass(index);
      case "compact":
        return "";
      default:
        return "";
    }
  };

  // Get article variant based on position in layout
  const getArticleVariant = (index) => {
    if (layoutType === "mobile-grid") {
      const position = index % 10;

      switch (position) {
        case 0: // Card 1
          return "hero";
        case 1: // Card 2
          return "text-only";
        case 2: // Card 3
        case 3: // Card 4
          return "title-only";
        case 4: // Card 5
        case 5: // Card 6
        case 6: // Card 7
        case 7: // Card 8
        case 8: // Card 9
          return "thumbnail-square";
        case 9: // Card 10
          return "hero";
        default:
          return "regular";
      }
    }

    if (layoutType === "featured") {
      // For first 8 items
      if (index < 8) {
        if (index === 0) return "hero"; // Main feature with image
        if (index >= 1 && index <= 4) return "text-only"; // Text-only cards (positions 2, 3, 4, 5)
        return "regular"; // Bottom cards with images (positions 6, 7, 8)
      } else {
        // For additional items after load more
        return "regular"; // Use regular cards for all additional items
      }
    }

    if (!hasEnoughItems) return index === 0 ? "feature" : "regular";

    if (layoutType === "magazine") {
      if (index === 0) return "hero";
      if (index === 1 || index === 2) return "feature";
      if (index === 3) return "horizontal";
      return index % 3 === 0 ? "horizontal" : "regular";
    }

    return index === 0 ? "feature" : "regular";
  };

  // Determine if we should use thumbnail version of image for this position
  const shouldUseThumbnail = (index) => {
    if (layoutType === "mobile-grid") {
      const position = index % 10;
      // Use thumbnails for cards 5-9 (thumbnail-square variant)
      return position >= 4 && position <= 8;
    }
    return false;
  };

  // Determine if a card should be in the horizontal scroll section (cards 5-9)
  const isHorizontalScrollCard = (index) => {
    const position = index % 10;
    return position >= 4 && position <= 8;
  };

  // Group cards by rows for rendering
  const groupNewsByRows = (newsItems) => {
    if (!newsItems || newsItems.length === 0) return [];

    const rows = [];
    let currentRow = [];
    let horizontalScrollItems = [];

    newsItems.forEach((item, index) => {
      const position = index % 10;

      // Group cards 5-9 into horizontal scroll containers
      if (position >= 4 && position <= 8) {
        horizontalScrollItems.push({ item, index });

        // When we reach the end of cards 5-9, add the horizontal scroll container
        if (position === 8 || index === newsItems.length - 1) {
          rows.push({
            type: "horizontalScroll",
            items: [...horizontalScrollItems],
          });
          horizontalScrollItems = [];
        }
      } else {
        // Regular card not in horizontal scroll
        rows.push({
          type: "regular",
          item,
          index,
        });
      }
    });

    return rows;
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6">
      {" "}
      {/* Reduced padding from px-4 sm:px-6 lg:px-8 py-8 */}
      {!isLoading && news.length === 0 ? (
        <motion.div className="flex flex-col justify-center items-center h-64 border border-gray-100 dark:border-gray-800 rounded-lg p-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No news articles found</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">Try adjusting your search or check back later for updates</p>
        </motion.div>
      ) : (
        <motion.div className={`${layoutType === "mobile-grid" ? "" : `grid gap-4 md:gap-5 ${getGridClass()}`}`} variants={containerVariants} initial="hidden" animate={mounted ? "visible" : "hidden"}>
          {/* Reduced gap from gap-5 md:gap-6 lg:gap-8 */}
          {isLoading ? (
            renderSkeletonCards()
          ) : layoutType === "mobile-grid" ? (
            // Mobile Grid Layout with Horizontal Scrolling section
            <div className="space-y-5">
              {groupNewsByRows(news).map((row, rowIndex) => {
                // For horizontal scroll section
                if (row.type === "horizontalScroll") {
                  return (
                    <div key={`row-${rowIndex}`} className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-1">Trending Stories</h3>
                      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        <div className="flex space-x-4" style={{ minWidth: "min-content" }}>
                          {row.items.map(({ item, index }) => {
                            const imageUrl = getImageUrl(item, true); // Always use thumbnail for horizontal scroll items
                            const title = item.headline?.main || "No Title";
                            const url = item.web_url || item.url || "#";

                            return (
                              <motion.div key={item.web_url || index} variants={cardVariants} className="w-[160px] flex-shrink-0 h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <NewsCard title={title} description={item.abstract || "No description available"} source={getSource(item)} url={url} imageUrl={imageUrl} onSave={() => onSave(item)} isSaved={savedNews.some((saved) => saved.web_url === item.web_url)} variant="thumbnail-square" isFeature={false} priority={false} />
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // For regular cards
                const item = row.item;
                const index = row.index;
                const imageUrl = getImageUrl(item, false);
                const title = item.headline?.main || "No Title";
                const url = item.web_url || item.url || "#";
                const variant = getArticleVariant(index);
                const gridClass = getItemClass(index);

                return (
                  <motion.div key={item.web_url || index} variants={cardVariants} className={`h-full ${gridClass}`} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index > 7 ? 0.1 : 0 }}>
                    <NewsCard title={title} description={item.abstract || "No description available"} source={getSource(item)} url={url} imageUrl={imageUrl} onSave={() => onSave(item)} isSaved={savedNews.some((saved) => saved.web_url === item.web_url)} variant={variant} isFeature={variant === "hero" || variant === "feature"} priority={index < 3} />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Other layouts (featured, magazine, etc.)
            news.map((item, index) => {
              const imageUrl = getImageUrl(item, shouldUseThumbnail(index));
              const title = item.headline?.main || "No Title";
              const url = item.web_url || item.url || "#";
              const variant = getArticleVariant(index);
              const gridClass = getItemClass(index);

              return (
                <motion.div key={item.web_url || index} variants={cardVariants} className={`h-full ${gridClass}`} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index > 7 ? 0.1 : 0 }}>
                  <NewsCard title={title} description={item.abstract || "No description available"} source={getSource(item)} url={url} imageUrl={imageUrl} onSave={() => onSave(item)} isSaved={savedNews.some((saved) => saved.web_url === item.web_url)} variant={variant} isFeature={variant === "hero" || variant === "feature"} priority={index < 3} />
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NewsGrid;

import styles from "./Tags.module.css";
import useEmblaCarousel from "embla-carousel-react";
import { useCourseContext } from "@/shared/courses/context";

import { useState } from "react";

export const Tags = () => {
  const { tags, filterCourses } = useCourseContext();
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [selectedTag, setSelectedTag] = useState("All");

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    filterCourses(tag);
  };

  return (
    <div className={styles.embla} ref={emblaRef}>
      <div className={styles.embla__container}>
        <div
          className={styles.embla__slide}
          onClick={() => handleTagClick("All")}
        >
          <p
            className={`${styles.tags} ${
              selectedTag === "All" && styles.active
            }`}
          >
            All
          </p>
        </div>
        {Array.from(tags).map((tag) => (
          <div
            className={styles.embla__slide}
            key={tag}
            onClick={() => handleTagClick(tag)}
          >
            <p
              className={`${styles.tags} ${
                selectedTag === tag && styles.active
              }`}
            >
              {tag}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

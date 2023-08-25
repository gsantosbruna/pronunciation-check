import useEmblaCarousel from "embla-carousel-react";
import styles from "./Carousel.module.css";
import { Course } from "@/shared/courses/interfaces";
import MainCard from "./elements/MainCard";
import FavoritesCard from "./elements/FavoritesCard";
import { useCourseContext } from "@/shared/courses/context";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface EmblaCarouselProps {
  title: string;
  Card: string;
}

export const EmblaCarousel = ({ title, Card }: EmblaCarouselProps) => {
  const { courses } = useCourseContext();
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  return (
    <>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.embla} ref={emblaRef}>
          <div ref={parent} className={styles.embla__container}>
            {courses.map((course: Course) => (
              <div className={styles.embla__slide} key={course.id}>
                {Card === "SimpleCard" ? (
                  <MainCard course={course} />
                ) : (
                  <FavoritesCard />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

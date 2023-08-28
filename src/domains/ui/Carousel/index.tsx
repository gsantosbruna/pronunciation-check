import useEmblaCarousel from "embla-carousel-react";
import styles from "./Carousel.module.css";
import { Course } from "@/domains/Training/interfaces/course";
import TrainingsCard from "./components/TrainingsCard";
import FavoritesCard from "./components/FavoritesCard";
import { useCourseContext } from "@/domains/Training/contexts/courseContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface EmblaCarouselProps {
  title: string;
  Card: string;
}

export const EmblaCarousel = ({ title, Card }: EmblaCarouselProps) => {
  const { courses } = useCourseContext();
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  return (
    <>
      <div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.embla}>
          <div ref={parent} className={styles.embla__container}>
            {courses.map((course: Course) => (
              <div className={styles.embla__slide} key={course.id}>
                {Card === "SimpleCard" ? (
                  <TrainingsCard course={course} />
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

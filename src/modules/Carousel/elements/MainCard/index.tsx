import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import styles from "./MainCard.module.css";
import { Course } from "@/shared/courses/interfaces";
import Link from "next/link";

interface MainCardProps {
  course: Course;
}

export default function MainCard({ course }: MainCardProps) {
  return (
    <Link href={`/training/${course.id}`}>
      <Card className={styles.card}>
        <div className={styles.media}>
          <CardMedia
            className={styles.media}
            component="img"
            alt={course.title}
            image={course.image}
          />
          <div className={styles.shadow}></div>
        </div>
        <h4>{course.title} </h4>
      </Card>
    </Link>
  );
}

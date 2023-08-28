import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import styles from "./TrainingsCard.module.css";
import { Course } from "@/domains/Training/interfaces/course";
import Link from "next/link";
import Image from "next/image";

interface MainCardProps {
  course: Course;
}

export default function TrainingsCard({ course }: MainCardProps) {
  return (
    <Link href={`/training/${course.id}`}>
      <Card className={styles.card}>
        <CardMedia>
          <div style={{ height: "100%" }}>
            <Image
              src={course.image}
              alt={course.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </CardMedia>
        <h4>{course.title} </h4>
      </Card>
    </Link>
  );
}

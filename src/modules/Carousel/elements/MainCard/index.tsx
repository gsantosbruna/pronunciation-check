import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import styles from './MainCard.module.css';
import { Course } from '@/shared/courses/interfaces';
import Link from 'next/link';

interface MainCardProps {
  course: Course;
}

export default function MainCard({ course }: MainCardProps) {
  return (
    // TODO: check the mui docks how they recommand to use the link component for clickable Card, if its like this then Good.
    <Link href={`/training/${course.id}`}>
      <Card className={styles.card}>
        <div className={styles.media}>
          <CardMedia
            className={styles.media}
            component="img"
            alt={course.title}
            image={course.image}
          />
          {/** TODO: on mui docs lookup the card comonent and the elevate props and shadow props, use the mui library built-in design token theme most of the time, */}
          <div className={styles.shadow}></div>
        </div>
        <h4>{course.title} </h4>
      </Card>
    </Link>
  );
}

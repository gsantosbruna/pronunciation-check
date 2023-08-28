"use client";
import Info from "../../../domains/Training/components/Info";
import { useCourseContext } from "@/domains/Training/contexts/courseContext";
import { useMemo } from "react";
import styles from "./Training.module.css";

export default function Training({ params }: { params: { id: string } }) {
  const { courses } = useCourseContext();

  const course = useMemo(
    () => courses.find((course) => course.id === Number(params.id)),
    [courses, params.id]
  );

  return (
    <div className={styles.content}>
      <Info
        title={course?.title}
        description={course?.description}
        tag={course?.tag}
      />
    </div>
  );
}

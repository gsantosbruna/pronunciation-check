"use client";
import React from "react";
import { useCourseContext } from "@/shared/courses/context";
import { useMemo } from "react";
import { useEffect } from "react";
import styles from "./Training.module.css";
import NavBar from "@/modules/NavBar";

export default function TrainingLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { courses } = useCourseContext();

  const course = useMemo(() => {
    return courses.find((course) => course.id === Number(params.id));
  }, [courses, params.id]);

  useEffect(() => {
    if (!course) return;

    document.body.style.backgroundImage = `url(${course.image})`;
    document.body.style.backgroundSize = "cover";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
    };
  }, [course]);

  return (
    <div className={styles.training}>
      <div className={styles.content}>
        <NavBar />
      </div>

      {children}
    </div>
  );
}

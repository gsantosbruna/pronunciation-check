"use client";
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Course } from "@/domains/Training/interfaces/course";
import coursejson from "../../../../public/courses.json";

interface CourseContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

export const CourseContext = createContext<CourseContextType>({
  courses: [],
  setCourses: () => {},
});

export const useTags = () => {
  const [unfilteredCourses, setUnfilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    setUnfilteredCourses(coursejson.courses);
  }, []);

  const tags = useMemo(
    () => Array.from(new Set(unfilteredCourses.map((course) => course.tag))),
    [unfilteredCourses]
  );

  return tags;
};

CourseContext.displayName = "Course";

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(coursejson.courses);

  return (
    <CourseContext.Provider value={{ courses, setCourses }}>
      {children}
    </CourseContext.Provider>
  );
};
export const useCourseContext = () => {
  const { courses, setCourses } = useContext(CourseContext);

  const tags = useTags();

  const filterCourses = useCallback(
    (tag: string) => {
      if (tag === "All") {
        setCourses(coursejson.courses);
      } else {
        const filteredCourses = coursejson.courses.filter(
          (course) => course.tag === tag
        );
        setCourses(filteredCourses);
      }
    },
    [setCourses]
  );

  const searchCourses = useCallback(
    (search: string) => {
      const filteredCourses = coursejson.courses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      );
      setCourses(filteredCourses);
    },
    [setCourses]
  );

  return { courses, setCourses, tags, filterCourses, searchCourses };
};

import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./SearchBar.module.css";
import { useCourseContext } from "@/domains/Training/contexts/courseContext";

export default function SearchBar() {
  const { searchCourses } = useCourseContext();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    searchCourses(value);
  };

  return (
    <div className={styles.search}>
      <SearchIcon />
      <input
        className={styles.input}
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

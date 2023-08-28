import React from "react";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./Back.module.css";

export default function Back() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div onClick={handleBackClick} className={styles.backButton}>
      <ArrowBackIcon fontSize="large" />
    </div>
  );
}

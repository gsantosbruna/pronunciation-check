import React from "react";
import Image from "next/image";
import styles from "./ProfileIcon.module.css";

export default function ProfileIcon() {
  return (
    <>
      <Image
        className={styles.icon}
        src="https://github.com/gsantosbruna.png"
        alt="Profile Icon"
      />
    </>
  );
}

import React from "react";
import styles from "./Welcome.module.css";

export default function Welcome() {
  return (
    <div>
      <h3 className={styles.title}>Hello</h3>
      <h2 className={styles.welcome}>Choose your pronunciation training.</h2>
      <button
        onClick={() =>
          // @ts-expect-error
          methodDoesNotExist()
        }
      >
        Break the world
      </button>
      ;
    </div>
  );
}

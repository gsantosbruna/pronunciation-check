import React from "react";
import { Card, CardMedia } from "@mui/material";
import styles from "./FavoritesCard.module.css";
import Favorite from "./favorite.svg";

export default function FavoritesCard() {
  return (
    <Card className={styles.card}>
      <div className={styles.media}>
        <CardMedia
          className={styles.media}
          component="img"
          alt="green iguana"
          image="https://github.com/gsantosbruna.png"
        />
      </div>
      <div className={styles.container}>
        <div>
          <h4>Lizard</h4>
          <p>tag</p>
        </div>
        <Favorite />
      </div>
    </Card>
  );
}

'use client';

import styles from "./page.module.css";
import NavBar from "@/modules/NavBar";
import Header from "@/modules/Header";
import { EmblaCarousel } from "@/modules/Carousel";

export default function Home() {
  return (
    <div>
      <NavBar />
      <Header />
      <EmblaCarousel title="Trainings" Card={"SimpleCard"} />
      {/* <EmblaCarousel title="Favorites" Card={"FavoriteCard"} /> */}
    </div>
  );
}

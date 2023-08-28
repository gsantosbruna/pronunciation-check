"use client";

import styles from "./page.module.css";
import NavBar from "@/domains/ui/NavBar";
import Header from "@/domains/ui/Header";
import { EmblaCarousel } from "@/domains/ui/Carousel";

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

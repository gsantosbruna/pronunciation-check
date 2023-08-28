"use client";

import React from "react";
import Welcome from "./components/Welcome";
import SearchBar from "./components/SearchBar";
import { Tags } from "./components/Tags";
// import { TagsCarousel } from "@/

export default function Header() {
  return (
    <>
      <Welcome />
      <SearchBar />
      <Tags />
    </>
  );
}

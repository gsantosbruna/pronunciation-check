"use client";

import React from "react";
import Welcome from "./elements/Welcome";
import SearchBar from "./elements/SearchBar";
import { Tags } from "./elements/Tags";
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

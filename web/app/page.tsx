import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Solutions from "./components/Solution";
import Technologies from "./components/Technologies";

export default function page() {
  return (
    <>
      {/* <Header /> */}
      <Hero />
      <Technologies />
      <Features />
      <Solutions />
    </>
  );
}

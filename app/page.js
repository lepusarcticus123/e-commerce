"use client";
import Navbar from "../components/Navbar";
import Display from "@/components/Display";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar site="home" />
      <Display></Display>
      <Footer></Footer>
    </div>
  );
}

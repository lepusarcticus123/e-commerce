"use client";
import Navbar from "../components/Navbar";
import Hot from "@/components/Hot";
import Display from "@/components/Display";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div>
      <Navbar site="home" />
      <Display></Display>
      <Footer></Footer>
    </div>
  );
}

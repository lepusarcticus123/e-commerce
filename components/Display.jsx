import Card from "./Card";
import { useEffect, useState } from "react";
import styles from "./display.module.css";
import Link from "next/link";

export default function Display() {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      const res = await fetch("https://dummyjson.com/products/categories");
      const category = await res.json();
      setCategory(category);
    };
    getCategory();
  }, []);

  return (
    <div className="w-11/12 mx-auto pt-20">
      <div className={styles.banner}>
        <p className="font-bold pt-32">WE GOT ALL YOU NEED</p>
        <Link
          href="/new"
          className="hover:shadow-xl sm:my-9 block sm:text-base lg:text-xl text-xs p-1 sm:p-3 md:p-4 sm:w-1/2 w-2/3 mx-auto bg-white rounded-3xl text-blue-900"
        >
          Discover Our Latest Collection{" "}
          <span className={styles.finger}>👉</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {category.map((item) => (
          <Card item={item} key={item.name}></Card>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import Loading from "./Loading";
import { useEffect, useState } from "react";

export default function Card({ item }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/category/${item.slug}`
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setData(data);
        localStorage.setItem("products", JSON.stringify(data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getProducts();
  }, [item.slug]);
  return (
    <div className=" bg-white shadow-lg hover:shadow-blue-300/60 rounded-lg transition-all duration-300 ease-in-out">
      {data ? (
        <Link href={`/category/${item.name}`}>
          <div className="p-4">
            <img
              src={data.products[0].images[0]}
              alt={item.name}
              className="md:w-11/12 md:p-5 w-8/12 mx-auto object-contain rounded-t-lg"
            />
            <div className="  mt-2 text-center">
              <div className="text-xl font-semibold">{item.name}</div>
              <div className=" text-gray-600 text-sm">
                {data.products[0].description}
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}

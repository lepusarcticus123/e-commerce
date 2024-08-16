"use client";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Category from "@/components/Category";

export default function CategoryPage({ params }) {
  const [category, setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(params.name);
  const [current, setCurrent] = useState(params.name);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getCatlist = async () => {
      const res = await fetch("https://dummyjson.com/products/category-list");
      const data = await res.json();
      setCategory(data);
    };
    getCatlist();
  });
  const handleCategoryClick = (item) => {
    setActiveCategory(item);
    setCurrent(item); // 设置当前类别为被点击的类别
  };
  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch(
        `https://dummyjson.com/products/category/${current}`
      );
      const data = await res.json();
      setProducts(data.products);
      console.log(data.products);
    };
    getProducts();
  }, [current]);
  return (
    <div>
      <Navbar site="category" />
      <div>
        <Category
          category={category}
          activeCategory={activeCategory}
          handleCategoryClick={handleCategoryClick}
        />
      </div>
      {products.length > 0 ? (
        <div className="w-11/12 mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product}></ProductCard>
          ))}
          <Footer />
        </div>
      ) : (
        <div className="">
          <Loading />
        </div>
      )}
    </div>
  );
}

"use client";
// 导入组件
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Category from "@/components/Category";

// 导出默认函数组件CategoryPage
export default function CategoryPage({ params }) {
  // 定义状态变量
  const [category, setCategory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(params.name);
  const [current, setCurrent] = useState(params.name);
  const [products, setProducts] = useState([]);
  // 使用useEffect钩子函数，在组件挂载时获取分类列表
  useEffect(() => {
    // 加载本地存储的信息
    if (localStorage.getItem("category")) {
      setCategory(JSON.parse(localStorage.getItem("category")));
    } else {
      const getCatlist = async () => {
        const res = await fetch("https://dummyjson.com/products/category-list");
        const data = await res.json();
        setCategory(data);
      };
      getCatlist();
    }
  }, []);
  // 定义处理分类点击事件的函数
  const handleCategoryClick = (item) => {
    setActiveCategory(item);
    setCurrent(item); // 设置当前类别为被点击的类别
  };
  // 使用useEffect钩子函数，在current变化时获取对应分类的商品列表
  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch(
        `https://dummyjson.com/products/category/${current}`
      );
      const data = await res.json();
      setProducts(data.products);
    };
    getProducts();
  }, [current]);
  // 返回组件结构
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
        <div className="absolute top-1/2 left-1/2 ">
          <Loading />
        </div>
      )}
    </div>
  );
}

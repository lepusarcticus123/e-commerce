"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartAnalysis from "@/components/CartAnalysis"; // 引入ECharts组件

export default function Cart() {
  // 定义购物车商品列表、商品列表、加载状态
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取购物车商品列表
  useEffect(() => {
    const fetchCarts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/show");
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        console.log("购物车", data);
        setCartItems(data);
      } catch (error) {
        // console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarts();
  }, []);

  // 获取商品列表
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        console.log(data.products);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 使用 useMemo 来避免每次渲染时都重新计算 productMap
  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  // 增加商品数量
  const handleAdd = (productId) => {
    const fetchAdd = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/add?product_id=" + productId,
          {
            method: "POST",
          }
        );
        if (!response.ok) throw new Error("Failed to add item to cart");
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.log("Error adding item to cart:", err);
      }
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    };
    fetchAdd();
  };

  // 减少商品数量
  const handleSub = (productId) => {
    const fetchSub = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/substruct?product_id=" + productId
        );
        if (!response.ok) throw new Error("Failed to add item to cart");
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.log("Error adding item to cart:", err);
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    };
    fetchSub();
  };
  const handleDelete = (productId) => {
    const fetchDelete = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/delete?product_id=" + productId
        );
        if (!response.ok) throw new Error("Failed to add item to cart");
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.log("Error adding item to cart:", err);
      }
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product_id !== productId)
      );
    };
    fetchDelete();
  };
  return (
    <div className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl">
      <Navbar />
      <div className="w-11/12 mx-auto shadow-xl p-5">
        {loading ? (
          <div className="pt-20 w-11/12 mx-auto">
            <Loading />
          </div>
        ) : cartItems.length > 0 ? (
          <div className="w-11/12 pt-20 mx-5">
            {cartItems.map((item) => {
              const product = productMap.get(item.product_id);
              if (!product) return null;
              return (
                <div
                  className=" sm:flex justify-between shadow-md rounded-md overflow-hidden mb-4"
                  key={product.id}
                >
                  <div className="sm:w-1/3 w-full">
                    <img
                      src={product.images[0]}
                      className="w-full h-full object-contain bg-slate-200"
                      alt={product.title}
                    />
                  </div>
                  <div className=" text-sm sm:text-base md:text-xl m:w-2/3 w-full my-5 sm:mx-10 mx-5">
                    <Link href={`/details/${product.id}`}>
                      <p className="m-2 font-serif">{product.title}</p>
                    </Link>

                    <p className="m-2">🔖 Brand:{product.brand}</p>
                    <p className="m-2">💵 price:{product.price}</p>
                    <div className="float-left md:w-28 w-24 rounded-md font-serif mt-10 border-2">
                      <div
                        onClick={() => handleAdd(product.id)}
                        className="inline-block p-3 cursor-pointer"
                      >
                        +
                      </div>
                      <p className="inline-block p-2">{item.quantity}</p>
                      <div
                        onClick={() => handleSub(product.id)}
                        className="inline-block p-3 cursor-pointer"
                      >
                        -
                      </div>
                    </div>
                    <div
                      onClick={() => handleDelete(product.id)}
                      className="float-left rounded-md p-2 my-11 sm:ml-5 ml-3 cursor-pointer  bg-orange-300"
                    >
                      ❌DELETE
                    </div>
                  </div>
                </div>
              );
            })}
            <CartAnalysis cartItems={cartItems} />
          </div>
        ) : (
          <div className="pt-24 pb-5 w-11/12 mx-auto text-center font-bold">
            <p className="pb-5 text-2xl font-serif">Your cart is empty</p>
            <Link href="/" className="mt-5 text-blue-300 hover:underline">
              To the index👉
            </Link>
          </div>
        )}
        <div className="md:text-xl text-sm">
          <Footer />
        </div>
      </div>
    </div>
  );
}

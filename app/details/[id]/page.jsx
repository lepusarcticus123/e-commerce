"use client";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Details({ params }) {
  const id = params.id;
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const images = product.images || [];
  const tags = product.tags || [];
  const router = useRouter();
  const [imageIdx, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product data");
        const data = await res.json();
        console.log(data);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleLeft = () => {
    setImageIndex((prevIdx) =>
      prevIdx === 0 ? images.length - 1 : prevIdx - 1
    );
  };

  const handleRight = () => {
    setImageIndex((prevIdx) =>
      prevIdx === images.length - 1 ? 0 : prevIdx + 1
    );
  };

  const addButton = useRef(null);
  const manipulateButton = useRef(null);

  useEffect(() => {
    if (manipulateButton.current) {
      manipulateButton.current.style.display = "none";
    }
  }, []);

  const handleAddToCart = async (productId, productCategory) => {
    try {
      const res = await fetch(`http://localhost:3000/add`, {
        method: "POST",
        body: JSON.stringify({ productId, productCategory }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      const data = await res.json();
      console.log(data);
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
    if (addButton.current && manipulateButton.current) {
      addButton.current.style.display = "none";
      manipulateButton.current.style.display = "block";
    }
  };
  const handleAdd = async (productId, productCategory) => {
    try {
      const res = await fetch(`http://localhost:3000/add`, {
        method: "POST",
        body: JSON.stringify({ productId, productCategory }),
      });
      const data = await res.json();
      console.log(data);
      setQuantity(quantity + 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  const handleSub = async (productId) => {
    if (quantity === 1) {
      if (addButton.current && manipulateButton.current) {
        manipulateButton.current.style.display = "none";
        addButton.current.style.display = "block";
      }
      try {
        const res = fetch(
          "http://localhost:3000/delete?product_id=" + productId
        );
        setQuantity(0);
      } catch (err) {
        console.log("err", err);
      }
    } else {
      setQuantity(quantity - 1);
      try {
        const res = await fetch(
          `http://localhost:3000/substruct?product_id=${productId}`
        );
        if (!res.ok) throw new Error("Failed to subtract item");
        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const generateStars = (numStars) => {
    return Array.from({ length: numStars }, () => (
      <span role="img" aria-label="star">
        ⭐
      </span>
    ));
  };

  return (
    <div>
      <Navbar />
      <div className="pt-20 sm:flex pb-10 shadow-xl">
        <div className="md:pl-10 px-10 md:w-1/2 w-full mx-auto relative">
          <div
            onClick={handleLeft}
            className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-slate-500 text-white hover:bg-white hover:text-slate-800 transition-all duration-300 rounded-full p-2 cursor-pointer"
          >
            &lt;
          </div>
          {loading ? (
            <div className="w-full h-full bg-gray-300 animate-pulse"></div>
          ) : (
            <img
              src={images[imageIdx]}
              className="w-full h-full object-cover border-solid bg-slate-300"
              alt=""
            />
          )}

          <div
            onClick={handleRight}
            className="absolute md:right-0 right-10 top-1/2 transform -translate-y-1/2 bg-slate-500 text-white hover:bg-white hover:text-slate-800 transition-all duration-300 rounded-full p-2 cursor-pointer"
          >
            &gt;
          </div>
        </div>
        <div className="font-mono pl-10 md:w-1/2 w-full">
          <h1 className="w-fit bg-slate-200 rounded p-2 md:text-3xl font-serif font-bold sm:text-xl text-base">
            {product.title}
          </h1>
          <p>💖 {product.description}</p>
          <p>
            <span className="inline-block">📍 </span> Brand: {product.brand}
          </p>
          <p>📦 {product.returnPolicy}</p>
          <p>🧾 {product.warrantyInformation}</p>
          <p>🚛 {product.shippingInformation}</p>
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-block mt-3 mr-7 bg-slate-200 rounded p-1"
            >
              {tag}
            </div>
          ))}
          <p className="text-2xl md:pt-20 py-3">
            💵 Price:
            <span className="line-through">
              {(
                (product.price / (1 - product.discountPercentage / 100)) *
                10
              ).toFixed(2)}
            </span>
            <span className="text-red-500 ml-2">{product.price}</span>
          </p>
          <div className="mt-5">
            <button
              ref={addButton}
              onClick={() => handleAddToCart(product.id, product.category)}
              className="bg-slate-200 rounded p-3"
            >
              Add to Cart
            </button>
            <div ref={manipulateButton}>
              <button
                className="bg-slate-200 mx-3 rounded py-1 px-3"
                onClick={() => handleAdd(product.id, product.category)}
              >
                +
              </button>
              <div className="inline-block pr-3">{quantity}</div>
              <button
                onClick={() => handleSub(product.id)}
                className="bg-slate-200 rounded py-1 px-3"
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="md:pt-10 pt-2">
        {loading ? (
          <div>
            <Loading></Loading>
          </div>
        ) : (
          <div className="pt-5 shadow-xl grid md:grid-cols-2 grid-cols-1 gap-10">
            {product.reviews.map((review) => {
              return (
                <div className="shadow-lg p-5 border-b-2 md:ml-10 ml-5  w-full">
                  <p className="text-xl">{review.comment}</p>
                  <p className="pt-5 float-right">{review.date}</p>
                  <p className="pt-1">{generateStars(review.rating)}</p>
                  <p className="pt-1 font-serif">{review.reviewerName}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

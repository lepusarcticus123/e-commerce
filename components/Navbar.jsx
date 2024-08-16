import Image from "next/image";
import Icon from "@/public/icon.png";
import Link from "next/link";
import Cart from "@/public/cart.svg";
import Trie from "@/lib/Trie";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Navbar({ site }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggest] = useState([]);
  const [trie, setTrie] = useState(new Trie());
  const [isLoggedIn, setIsLoggedIn] = useState("");

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("isLoggedIn="));
    if (cookie) {
      setIsLoggedIn(cookie.split("=")[1]);
    }
  }, []);

  const router = useRouter();
  const active =
    "hidden  sm:block bg-blue-300/80 m-3 p-3 rounded cursor-pointer transition-all duration-500 text-white";
  const unactive =
    "hidden sm:block hover:bg-blue-300/80 text-blue-300/80 p-3 hover:text-white rounded cursor-pointer transition-all duration-500";
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      const products = data.products;
      console.log(products);
      const newTrie = new Trie();
      products.map((product) => {
        newTrie.insert(product.title);
      });
      setTrie(newTrie);
      console.log("trie", trie);
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    const getSuggestions = (query) => {
      let suggestions = [];
      const node = trie._findNode(query);
      console.log("node", node);
      if (node) {
        console.log(node);
        suggestions = trie.collectWords(node, query);
      } else {
        console.log("no");
      }
      setSuggest(suggestions);
    };
    if (query) {
      getSuggestions(query);
    } else {
      setSuggest([]);
    }
  }, [query, trie]);
  // console.log(trie);
  const search = (suggestion) => {
    router.push("/search/" + suggestion);
  };
  return (
    <nav className=" flex fixed z-20 bg-slate-100/10 backdrop-blur-2xl font-mono justify-between items-center sm:text-md md:text-lg lg:text-xl shadow-md w-full">
      <div className="flex items-center">
        <Image src={Icon} alt="icon" width={50} height={50} />
        <Link className="block text-blue-300/80" href="/">
          Ecommerce
        </Link>
      </div>
      <div className={site == "home" ? active : unactive}>
        <Link href="/">Home</Link>
      </div>
      <div className={site == "category" ? active : unactive}>
        <Link href="/category/beauty">Category</Link>
      </div>
      <div className={site == "contact" ? active : unactive}>
        <Link href="/contact">Contact Us</Link>
      </div>
      <div className=" ">
        <input
          type="text"
          className="w-3/4 h-8 ml-8 pl-3 bg-slate-200/30 rounded-2xl outline-none placeholder:text-blue-300/80 caret-slate-200"
          placeholder="search..."
          onChange={(e) => setQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 rounded-lg mt-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => search(suggestion)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isLoggedIn ? (
        <div className="ml-5 ">
          <Link className=" inline-block my-2" href="/cart">
            <Image src={Cart} alt="cart" width={40} height={40}></Image>
          </Link>
        </div>
      ) : (
        <Link href="/login">
          <div className="hover:bg-blue-300/80 text-blue-300/80 hover:text-white p-3 my-2 rounded cursor-pointer transition-all duration-500">
            Login
          </div>
        </Link>
      )}
    </nav>
  );
}

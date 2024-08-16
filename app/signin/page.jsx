"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // 使用 useRouter 钩子

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password, email }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message);
      setTimeout(() => {
        router.push("/login"); // 两秒后重定向到登录页面
      }, 2000);
    } else {
      setError(data.message);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000); // 两秒后清空 error 消息

      return () => clearTimeout(timer); // 清除定时器
    }
  }, [error]);

  return (
    <div className="bg-gradient-to-r pt-40 from-blue-200 via-purple-200 to-pink-200 w-full h-screen">
      {error && (
        <div className="absolute left-1/3 font-serif text-white text-center top-20 text-xl">
          ❗️ {error}
        </div>
      )}
      {message ? (
        <div>
          {message && (
            <div className="rounded-2xl flex-none mx-auto w-96 h-48 bg-white font-serif text-xl text-white">
              <p className="py-5 text-center pt-20 text-pink-200">{message}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="xl:w-1/3 md:w-1/2 w-3/4 mx-auto h-2/3 shadow-xl bg-white rounded-xl">
          <p className="text-center md:text-2xl text-xl py-8 font-serif">
            SIGN IN
          </p>
          <div className="w-full flex flex-col items-center justify-center">
            <p className="w-full m-3">
              <span className="md:text-xl inline-block w-5/12 text-center">
                {" "}
                🪄 Name:
              </span>
              <input
                className="font-serif w-1/2 shadow-inner border-b-2 outline-none border-blue-100 rounded p-1 caret-gray-400"
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </p>
            <p className="w-full m-3">
              <span className="md:text-xl inline-block w-5/12 text-center">
                {" "}
                📧 E-mail:
              </span>
              <input
                className="font-serif w-1/2 shadow-inner border-b-2 outline-none border-blue-100 rounded p-1 caret-gray-400"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </p>
            <p className="w-full m-3">
              <span className="md:text-xl inline-block w-5/12 text-center">
                🔒Password:
              </span>
              <input
                className="font-serif w-1/2 shadow-inner border-b-2 outline-none border-blue-100 rounded p-1 caret-gray-400"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
            <p>
              Already have an account?{" "}
              <Link
                className="text-xl underline text-blue-300 font-serif"
                href="/loginin"
              >
                Log in
              </Link>
            </p>
            <div
              onClick={handleSubmit}
              className="hover:bg-pink-200 transistion-all duration-300 hover:text-white mt-10 font-serif text-xl rounded-2xl cursor-pointer shadow-pink-300 w-1/3 p-3 shadow-sm text-center"
            >
              Sign in
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

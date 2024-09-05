"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      setTimeout(() => router.push("/"), 1300);
    } else {
      setError(data.message);
    }
    return res;
  };
  return (
    <div className="bg-gradient-to-r flex pt-40 from-blue-200 via-purple-200 to-pink-200 w-full h-screen">
      {error && (
        <div className="absolute w-1/2 left-1/4 bg-white font-serif  text-black text-center top-10 rounded-md p-3 transition-all duration-75 text-xl">
          ❗️ {error}
        </div>
      )}
      {message ? (
        <div>
          {message && (
            <div className="absolute left-1/3 top-1/3 rounded-2xl flex-none w-96 h-48 bg-white font-serif text-xl text-white">
              <p className="py-5 text-center pt-20 text-pink-500">{message}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="xl:w-1/3 md:w-1/2 w-3/4 mx-auto h-2/3 shadow-xl bg-white rounded-xl">
          <p className="text-center md:text-2xl text-xl py-8  font-serif">
            LOG IN
          </p>
          <div className="w-full flex flex-col items-center justify-center">
            <p className="w-full m-5">
              <span className="md:text-xl inline-block w-5/12 text-center">
                {" "}
                📧 E-mail:
              </span>
              <input
                className=" w-1/2 shadow-inner border-b-2 outline-none border-blue-100 rounded p-1 caret-gray-400"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </p>
            <p className="w-full m-5">
              <span className="md:text-xl inline-block w-5/12 text-center">
                🔒Password:
              </span>
              <input
                className=" w-1/2 shadow-inner border-b-2 outline-none border-blue-100 rounded p-1 caret-gray-400"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
            <p>
              Dont have an account?{" "}
              <Link
                className="text-xl underline text-pink-300 font-serif"
                href="/signin"
              >
                Sign in
              </Link>
            </p>
            <div
              onClick={handleSubmit}
              className="hover:bg-blue-200 transistion-all duration-300 hover:text-white mt-20 font-serif text-xl rounded-2xl cursor-pointer shadow-blue-300 w-1/3 p-3 shadow-sm text-center"
            >
              ✈️ Log in
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // 从cookie中获取token
  const cookies = cookie.parse(req.headers.get("cookie") || ""); // 确保参数是字符串
  const token = cookies.token;

  // 如果没有token，重定向到登录页面
  if (!token) {
    console.log("没有登陆");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    return NextResponse.next();
  } catch (error) {
    console.log("我是error", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/cart", "/details/:path*"],
};

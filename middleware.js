import jwt from "jsonwebtoken";
import cookie from "cookie";
import { NextResponse } from "next/server";
export async function middleware(req) {
  // 从cookie里面拿到token
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.token;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return { status: 200, user: decoded };
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: ["/cart", "/details/:path*"],
};

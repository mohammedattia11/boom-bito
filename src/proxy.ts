import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "./lib/redis";

export const proxy = async (req: NextRequest) => {
  const pathName = req.nextUrl.pathname;
  const matchedRoom = pathName.match(/^\/room\/([^/]+)$/);

  if (!matchedRoom) return NextResponse.redirect(new URL("/", req.url));

  const roomId = matchedRoom[1];
  const meta = await redis.hgetall<{ connected: string[]; createdAt: number }>(
    `meta:${roomId}`
  );

  if (!meta) {
    return NextResponse.redirect(new URL("/?error=room-not-found", req.url));
  }
  const existedToken = req.cookies.get("x-auth-token")?.value;
  if (existedToken && meta.connected.includes(existedToken)) {
    return NextResponse.next();
  }
  if (meta.connected.length >= 2) {
    return NextResponse.redirect(new URL("/?error=full-room", req.url));
  }

  const response = NextResponse.next();
  const token = nanoid();
  response.cookies.set("x-auth-token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  await redis.hset(`meta:${roomId}`, {
    connected: [...meta.connected, token],
  });
  return response;
};

export const config = {
  matcher: "/room/:path*",
};

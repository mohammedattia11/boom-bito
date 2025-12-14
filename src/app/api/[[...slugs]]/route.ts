import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import z from "zod";
import { authMiddleware } from "./auth";
const ROOM_TTL = 60 * 10;
const rooms = new Elysia({ prefix: "/rooms" }).post("/create", async () => {
  const roomId = nanoid();
  await redis.hset(`meta:${roomId}`, {
    connected: [],
    createdAt: Date.now(),
  });
  await redis.expire(`meta:${roomId}`, ROOM_TTL);
  return { roomId };
});
const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleware)
  .post(
  "/",
  async ({ body, auth }) => {
    const { sender, text } = body;
    const {roomId} = auth;
    const roomExists = await redis.exists(`meta:${roomId}`);
    if (!roomExists) {
      throw new Error("Room does not exist!")
    }
  },
  {
    query: z.object({
      roomId: z.string(),
    }),
    body: z.object({
      sender: z.string().max(100),
      text: z.string().max(1000),
    }),
  }
);
const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

export type app = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;

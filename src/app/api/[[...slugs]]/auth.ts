import { redis } from "@/lib/redis";
import Elysia from "elysia";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const authMiddleware = new Elysia({ name: "auth" })
  .error({ AuthError })
  .onError(({ code, set, error }) => {
    if (code === "AuthError") {
      set.status = 401;
      return { error: error.message };
    }
  })
  .derive({ as: "scoped" }, async ({ query, cookie }) => {
    const roomId = query.roomId;
    const token = cookie["x-auth-token"]?.value as string | undefined;

    if (!roomId || !token) {
      throw new AuthError(
        "Missing roomID or user isn't allowed to join the room"
      );
    }

    const connected = await redis.hget<ConnectedUsersType[]>(`meta:${roomId}`, "connected");
    const avatar = connected?.find(user => user.token === token)?.avatar
    if (!connected?.some(user => user.token === token)) {
      throw new AuthError("Current user is not a part of this room");
    }
    return { auth: { roomId, token,avatar, connected } };
  });
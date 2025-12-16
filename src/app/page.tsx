"use client";
import { ErrorMessage } from "@/components/error-message";
import Typewriter from "@/components/type-writter";
import { useCreateRoom } from "@/hooks/use-create-room";
import { useUsername } from "@/hooks/use-username";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { createRoom, isPending } = useCreateRoom();
  const username = useUsername();
  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {wasDestroyed && <ErrorMessage errorMessage="destroyed" />}
        {error === "room-not-found" && (
          <ErrorMessage errorMessage="room-not-found" />
        )}
        {error === "full-room" && <ErrorMessage errorMessage="full-room" />}
        <div className="text-center space-y-2 min-h-16">
          <h1 className="font-bold text-2xl text-green-500 tracking-tight">
            {">"}
            <Typewriter text="private_chat" />
          </h1>
          <p className="text-zinc-500">
            {isLoaded && (
              <Typewriter text="A private, self-destructing chat room." />
            )}
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500">
                Your Identity
              </label>
              <div className="flex items-center-gap-3">
                <div className="bg-zinc-950 border border-zinc-800 flex-1 p-3 text-sm text-zinc-400 font-mono">
                  {username}
                </div>
              </div>
            </div>
            <button
              onClick={() => createRoom()}
              disabled={isPending}
              className={
                "w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 transition-colors mt-2 cursor-pointer disabled:opacity-50"
              }
            >
              {isPending ? "CREATING ROOM..." : "CREATE SECURE ROOM"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

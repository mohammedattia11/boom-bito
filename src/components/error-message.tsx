"use client";

import { useState } from "react";

export function ErrorMessage({ errorMessage }: { errorMessage: string }) {
  const [isOpened, setIsOpened] = useState(true);
  const message = {} as { header: string; content: string };
  if (errorMessage === "destroyed") {
    message.header = "ROOM DESTROYED";
    message.content = "All messages permanently deleted.";
  }
  if (errorMessage === "room-not-found") {
    message.header = "ROOM NOT FOUND";
    message.content = "This room may have expired or never existed.";
  }
  if (errorMessage === "full-room") {
    message.header = "ROOM FULL";
    message.content = "This room at the maximum capacity.";
  }
  return (
    isOpened && (
      <div className=" relative bg-red-950/50 border border-red-900 p-4 text-center">
        <p className="text-red-500 font-bold">{message.header}</p>
        <p className="text-zinc-500 text-sm font-semibold mt-1">
          {message.content}
        </p>
        <button
          onClick={() => {
            if (isOpened) setIsOpened(false);
          }}
          className="absolute right-3 top-0 cursor-pointer text-xl text-zinc-500"
        >
          &#10007;
        </button>
      </div>
    )
  );
}

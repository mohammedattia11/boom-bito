"use client";
import RoomHeader from "@/components/room-header";
import { useRoomMessages } from "@/hooks/use-room-messages";
import { useUsername } from "@/hooks/use-username";
import { useRealtime } from "@/lib/realtime-client";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function RoomPage() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const username = useUsername();
  const { messages, refetchMessages, sendMessage, isSending } = useRoomMessages(
    roomId,
    username
  );

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetchMessages();
      }
      if (event === "chat.destroy") {
        router.push("/?destroyed=true");
      }
    },
  });
  
  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden">
      <RoomHeader roomId={roomId} router={router}/>
      {/* room body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="h-full flex justify-center items-center">
            <p className="text-zinc-500 text-sm font-mono">
              No messages yet, start the conversation...
            </p>
          </div>
        )}
        {messages?.messages.map(msg => (
          <div key={msg.id} className="flex flex-col items-start">
            <div className="w-[80%] group">
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className={`text-xs font-bold ${
                    msg.sender === username ? "text-green-500" : "text-blue-500"
                  }`}
                >
                  {msg.sender === username ? "YOU" : msg.sender}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {format(msg.timeStamp, "HH:mm")}
                </span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed break-all">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 animate-pulse">
              {">"}
            </span>
            <input
              autoFocus
              onKeyDown={e => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage({ text: input });
                  setInput("");
                  inputRef.current?.focus();
                }
              }}
              placeholder="Type message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              type="text"
              className="w-full bg-black border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 py-3 pl-8 pr-4 text-sm"
            />
          </div>
          <button
            onClick={() => {
              inputRef.current?.focus();
              sendMessage({ text: input });
              setInput("");
            }}
            disabled={!input.trim() || isSending}
            className="bg-zinc-800 text-zinc-400 px-6 text-sm font-bold hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            SEND
          </button>
        </div>
      </div>
    </main>
  );
}

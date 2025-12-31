import { useDestroyRoom } from "@/hooks/use-destroy-room";
import { useTimeRemaining } from "@/hooks/use-time-remaining";
import { formatTime } from "@/utils/format-time";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { FaBomb } from "react-icons/fa6";

export default function RoomHeader({roomId,router}:{roomId:string,router:AppRouterInstance}) {
  const [copyStatus, setCopyStatus] = useState("COPY");
  const timeRemaining = useTimeRemaining(roomId, router);
  const destroyRoom = useDestroyRoom(roomId);
  function copyLink() {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopyStatus("COPIED!!");
      setTimeout(() => setCopyStatus("COPY"), 2000);
    }
  return (
    <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-zinc-500 text-sm uppercase">Room ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-green-500">{roomId}</span>
                  <button
                    onClick={copyLink}
                    className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {copyStatus}
                  </button>
                </div>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 uppercase">
                  {window.innerWidth > 400 && "Self-Destruct"}
                </span>
                <span
                  className={`text-sm font-bold flex items-center gap-2 ${
                    timeRemaining !== null && timeRemaining < 60
                      ? "text-red-500"
                      : "text-amber-500"
                  }`}
                >
                  {timeRemaining !== null
                    ? formatTime(timeRemaining)
                    : "--:--"}
                </span>
              </div>
            </div>
            <button
              onClick={() => destroyRoom()}
              className="bg-zinc-800 hover:bg-red-600 text-xs px-3 py-1.5 rounded text-zinc-400 hover:text-white font-bold transition-all group flex gap-2 items-center disabled:opacity-50"
            >
              <span className="group-hover:animate-pulse pb-1">
                <FaBomb size={window.innerWidth > 400 ?18 : 15} />
              </span>
              {window.innerWidth > 400 && "DESTROY NOW"}
            </button>
          </header>
  )
}
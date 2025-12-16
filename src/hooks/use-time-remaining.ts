import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";

export function useTimeRemaining(roomId:string,router:AppRouterInstance) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { data: room } = useQuery({
      queryKey: ["ttl", roomId],
      queryFn: async () => {
        const res = await client.rooms.ttl.get({ query: { roomId } });
        return res.data;
      },
    });
  
    useEffect(() => {
      if (room?.ttl !== undefined) {
        // eslint-disable-next-line
        setTimeRemaining(room.ttl);
      }
    }, [room]);
  
    useEffect(() => {
      if (timeRemaining === null || timeRemaining < 0) return;
      if (timeRemaining === 0) {
        router.push("/?destroyed=true");
      }
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }, [timeRemaining, router]);
  return timeRemaining
}
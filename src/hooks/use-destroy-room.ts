import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";

export function useDestroyRoom(roomId:string) {
  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.rooms.delete(null, { query: { roomId } });
    },
  });
  return destroyRoom;
}
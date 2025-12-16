import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useCreateRoom() {
  const router = useRouter();
  const { mutate: createRoom, isPending } = useMutation({
      mutationFn: async () => {
        const res = await client.rooms.create.post();
        if (res.status === 200) {
          router.push(`/room/${res.data?.roomId}`);
        }
      },
    });
  return {createRoom,isPending}
}
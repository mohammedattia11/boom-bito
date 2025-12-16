import { client } from "@/lib/client";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useRoomMessages(roomId:string,username:string) {
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await client.messages.post(
        { sender: username, text },
        { query: { roomId } }
      );
    },
  });
  const { data: messages, refetch:refetchMessages } = useQuery({
      queryKey: ["messages", roomId],
      queryFn: async () => {
        const res = await client.messages.get({ query: { roomId } });
        return res.data;
      },
    });
  return {sendMessage,isSending, messages, refetchMessages}
}
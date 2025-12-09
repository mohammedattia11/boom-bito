"use client";

import { useParams } from "next/navigation";

export default function RoomPage() {
  const {roomId} = useParams();
  return <div>Your current room is {roomId}</div>;
}

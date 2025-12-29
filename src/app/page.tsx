import Lobby from "@/components/lobby";
import { Suspense } from "react";

export default function Home() {
  return <Suspense>
    <Lobby/>
  </Suspense>
}

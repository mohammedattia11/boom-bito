export function ErrorMessage({ errorMessage }: { errorMessage: string }) {
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
    <div className="bg-red-950/50 border border-red-900 p-4 text-center">
      <p className="text-red-500 font-bold">{message.header}</p>
      <p className="text-zinc-500 text-sm font-semibold mt-1">{message.content}</p>
    </div>
  );
}

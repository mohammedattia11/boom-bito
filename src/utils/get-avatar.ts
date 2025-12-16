const avatars = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png"
]
export function getAvatar(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % avatars.length;
  return avatars[index];
}
export async function loadRooms(): Promise<string[]> {
  const response = await fetch("/Buildings.txt");
  const text = await response.text();
  const rooms = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return rooms;
}

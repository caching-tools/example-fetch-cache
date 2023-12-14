export function formatTime(time: number | string | Date): string {
  return new Date(time).toLocaleTimeString("en-GB", {
    fractionalSecondDigits: 3,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

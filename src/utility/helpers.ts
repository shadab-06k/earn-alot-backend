// utils/time.ts
export const now = () => new Date();

export const addMinutes = (d: Date, minutes: number) =>
  new Date(d.getTime() + minutes * 60 * 1000);

// human readable "12:00 AM" style in IST by default
export function formatAmPmIST(date: Date, tz = "Asia/Kolkata") {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

// compute seconds left (never negative)
export function secondsRemaining(endsAt: Date) {
  const diffMs = endsAt.getTime() - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
}

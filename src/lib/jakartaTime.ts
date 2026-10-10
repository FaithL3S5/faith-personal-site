const jakartaPartsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type JakartaParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
};

export function getJakartaParts(date: Date): JakartaParts {
  const parts = Object.fromEntries(
    jakartaPartsFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return {
    year: parts.year,
    month: monthNames[Number(parts.month) - 1],
    day: String(Number(parts.day)),
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

export const clockSuffix = "UTC+07:00";

export const clockPlaceholder = `--:--:-- ${clockSuffix}`;

export function formatJakartaClock(date: Date): string {
  const { hour, minute, second } = getJakartaParts(date);
  return `${hour}:${minute}:${second} ${clockSuffix}`;
}

import { getJakartaParts } from "./jakartaTime";

export function formatBuildStamp(commitSha: string | undefined, builtAtIso: string | undefined) {
  const shortSha = commitSha ? commitSha.slice(0, 7) : "local";
  const builtAt = builtAtIso ? new Date(builtAtIso) : null;
  if (!builtAt || Number.isNaN(builtAt.getTime())) return shortSha;

  const { day, month, year, hour, minute } = getJakartaParts(builtAt);
  return `${shortSha}, deployed ${day} ${month} ${year}, ${hour}:${minute}`;
}

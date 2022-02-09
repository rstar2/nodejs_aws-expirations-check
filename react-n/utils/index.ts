import { ListItem } from "./../types";
export function noop(): void {}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, dateFormatOptions);
}

export function sortByDate(a: ListItem, b: ListItem): 0 | -1 | 1 {
  const aDate = a.expiresAt.getTime();
  const bDate = b.expiresAt.getTime();
  if (aDate === bDate) return 0;
  return aDate < bDate ? -1 : 1;
}

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

/**
 * Gets the date for either today or tomorrow, with optional formatting.
 *
 * @param day - Whether to get today or tomorrow's date
 * @param formatted - Whether to format the date as "YYYY-MM-DD"
 * @returns A { year: number, month: string, Day: string } object, or
 *          a string in the format "YYYY-MM-DD" if `formatted` is true.
 */
function getDate(
  day: "today" | "tomorrow",
  formatted?: false
): { year: number; month: string; date: string };
function getDate(day: "today" | "tomorrow", formatted?: true): string;
function getDate(day: "today" | "tomorrow", formatted = false) {
  const today = new Date();
  if (day === "tomorrow") today.setDate(today.getDate() + 1);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const date = String(today.getDate()).padStart(2, "0");

  if (formatted) {
    return `${year}-${month}-${date}`;
  }

  return { year, month, date };
}

export default getDate;

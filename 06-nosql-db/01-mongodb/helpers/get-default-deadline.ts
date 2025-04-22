export default function getDefaultDeadline(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date;
}

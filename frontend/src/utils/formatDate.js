import { formatDistanceStrict, format } from "date-fns";

export function getSmartDate(dateStr) {
  const createdDate = new Date(dateStr);
  const now = new Date();
  const diffInDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

  return diffInDays < 7
    ? `${formatDistanceStrict(createdDate, now, { addSuffix: true })}`
    : format(createdDate, 'MMM d, yyyy');
}

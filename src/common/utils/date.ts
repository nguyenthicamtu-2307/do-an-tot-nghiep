import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function convertUTCDate(date?: string) {
  return date ? dayjs(date).utc().toDate() : null;
}

export const nowYYYYMMDD = () => {
  return dayjs().format('YYYY-MM-DD');
};

export const formatDate = (
  value: string | number | Date | dayjs.Dayjs | null | undefined,
  format = 'MM/DD/YYYY',
) => {
  if (!value) return '';
  return dayjs(value).format(format);
};

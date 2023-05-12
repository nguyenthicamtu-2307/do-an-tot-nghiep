import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(dayOfYear);

const hawaiiTimezone = 'US/Hawaii';

export const dayOfYearInHawaii = (dateTime?: string | Date) =>
  dayjs(dateTime).tz(hawaiiTimezone).dayOfYear();

export const dateTimeInHawaii = (dateTime?: string | Date) =>
  dayjs(dateTime).tz(hawaiiTimezone);

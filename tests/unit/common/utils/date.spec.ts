import { convertUTCDate, nowYYYYMMDD } from '@common/utils';
import dayjs from 'dayjs';

describe('DateUtils', () => {
  describe('convertUTCDate', () => {
    test('should return null when date is invalid', () => {
      expect(convertUTCDate(undefined)).toBeNull();
    });

    test('should format date string to UTC Date', () => {
      const dateString = '2022-03-11';
      const expected = dayjs(dateString).utc().toDate();

      expect(convertUTCDate(dateString)).toEqual(expected);
    });
  });

  describe('nowYYYYMMDD', () => {
    test('should return current date by UTC timezone with format YYYY-MM-DD', () => {
      const result = nowYYYYMMDD();
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[01])$/;
      expect(result).toMatch(regex);
    });
  });
});

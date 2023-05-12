import { Prisma } from '@prisma/client';
import _ from 'lodash';
import { dayOfYearInHawaii } from './hawaii-date';

export enum IdNoTypeEnum {
  USER = '',
  PROPERTY = 'P',
}

export const normalizeFileName = (str?: string) => {
  return str ? str.replace(/[^a-z0-9.]/gi, '_').toLowerCase() : undefined;
};

export const getStartCase = (string: string) =>
  _.startCase(string?.toLowerCase());

export const formatIdNoByType = (
  type: IdNoTypeEnum,
  digits: number,
  id?: number,
) => {
  return id
    ? type
      ? `${type}-${id.toString().padStart(digits, '0')}`
      : `${id.toString().padStart(digits, '0')}`
    : '';
};

export const filterOperationByMode = (
  search?: string,
  mode: Prisma.QueryMode = Prisma.QueryMode.insensitive,
): Prisma.StringFilter | undefined => {
  return search ? { contains: search, mode } : undefined;
};

export const getConfirmationNumber = (
  sequenceNumber: number,
  dayOfYear?: number,
) =>
  `DD-${sequenceNumber.toString().padStart(4, '0')}-0-${
    dayOfYear || dayOfYearInHawaii()
  }`;

interface RandomStringOptions {
  lowerCase?: boolean;
  upperCase?: boolean;
  digit?: boolean;
}

const LOWER_CASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const UPPER_CASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';

export const randomString = (
  length: number,
  options: RandomStringOptions = {
    lowerCase: true,
    upperCase: true,
    digit: true,
  },
) => {
  let { lowerCase, upperCase, digit } = options;

  if (lowerCase === undefined) lowerCase = true;
  if (upperCase === undefined) upperCase = true;
  if (digit === undefined) digit = true;

  let characters = '';

  if (lowerCase) characters += LOWER_CASE_LETTERS;
  if (upperCase) characters += UPPER_CASE_LETTERS;
  if (digit) characters += DIGITS;

  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

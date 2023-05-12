import {
  filterOperationByMode,
  formatIdNoByType,
  IdNoTypeEnum,
  normalizeFileName,
} from '@common/utils/generator';
import { Prisma } from '@prisma/client';

describe('GeneratorUtils', () => {
  describe('normalizeFileName', () => {
    test('should return undefined when string is empty/null/undefined', () => {
      expect(normalizeFileName(undefined)).toBeUndefined();
    });

    test('should safely return normalize', () => {
      expect(normalizeFileName('ABC-DE')).toBe('abc_de');
    });
  });

  describe('formatIdNoByType', () => {
    test('should return empty if ID No is not valid', () => {
      expect(formatIdNoByType(IdNoTypeEnum.USER, 5, undefined)).toBe('');
    });

    test('should format the ID No when type is empty', () => {
      expect(formatIdNoByType(IdNoTypeEnum.USER, 5, 1)).toBe('00001');
    });

    test('should format the ID No by type', () => {
      expect(formatIdNoByType(IdNoTypeEnum.PROPERTY, 5, 1)).toBe('P-00001');
    });
  });

  describe('filterOperationByMode', () => {
    test('should return undefined if search param does not valid', () => {
      expect(
        filterOperationByMode(undefined, Prisma.QueryMode.insensitive),
      ).toBeUndefined();
    });

    test('should return filter operation by mode', () => {
      expect(
        filterOperationByMode('test', Prisma.QueryMode.insensitive),
      ).toEqual({
        contains: 'test',
        mode: Prisma.QueryMode.insensitive,
      });
    });
  });
});

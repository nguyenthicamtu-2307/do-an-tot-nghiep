import {
  IsOrderQueryParam,
  isValidOrder,
} from '@common/decorator/order.decorator';
import { OrderEnum } from '@common/utils';
import { BadRequestException } from '@nestjs/common';
import { Validator } from 'class-validator';

enum MockOrderByEnum {
  NAME = 'name',
}

class MockOrderClass {
  @IsOrderQueryParam('order', MockOrderByEnum)
  order: string;
}

const validator = new Validator();

describe('OrderDecorator', () => {
  describe('isValidOrder', () => {
    test('should handle error when order field does not match any enum value', () => {
      const orderBy = 'nam';

      expect(() => {
        isValidOrder(orderBy, 'asc', MockOrderByEnum);
      }).toThrowError(
        new BadRequestException(
          `orderField must be in: ${Object.values(
            MockOrderByEnum,
          )}. Your value: '${orderBy}'`,
        ),
      );
    });

    test('should handle error when order direction does not match any enum value', () => {
      const orderBy = MockOrderByEnum.NAME;
      const orderDirection = 'asb';

      expect(() => {
        isValidOrder(orderBy, orderDirection, MockOrderByEnum);
      }).toThrowError(
        new BadRequestException(
          `orderDirection must be in: ${Object.values(
            OrderEnum,
          )}. Your value: '${orderDirection}'`,
        ),
      );
    });

    test('should return true when it is a valid order', () => {
      expect(isValidOrder(MockOrderByEnum.NAME, 'asc', MockOrderByEnum)).toBe(
        true,
      );
    });
  });

  describe('IsOrderQueryParam', () => {
    test('should return no errors when the order query param is correct', () => {
      const model = new MockOrderClass();
      model.order = `${MockOrderByEnum.NAME},asc`;

      return validator
        .validate(model)
        .then((errors) => expect(errors).toHaveLength(0));
    });
  });
});

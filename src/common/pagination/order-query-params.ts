/**
 * Type of order direction
 */
export type OrderDirection = 'asc' | 'desc';

/**
 * Type of field that is ordered
 */
export type OrderField = { field: string; direction: OrderDirection };

/**
 * The order request params
 *
 * @interface
 */
export interface OrderRequestParams {
  fields: OrderField[];
}

/**
 * Default implementation of order request params
 *
 * @class
 * @implements {OrderRequestParams}
 */
export class DefaultOrderRequestParams implements OrderRequestParams {
  constructor(public readonly fields: OrderField[]) {}
}

type Constructor<T = Record<string, never>> = new (...args: any[]) => T;
type Orderable = Constructor<OrderRequestParams>;

/**
 * Mixin to create the order params with allowed fields
 *
 * @param Base base type of the order params
 * @param type allowed fields to order, best to be in Typescript enum
 * @returns class that implements TBase
 * @template TBase
 * @template TOrders
 */
export const OrderParams = <
  TBase extends Orderable,
  TOrders extends Record<string, string>,
>(
  Base: TBase,
  type: TOrders,
) => {
  return class OrderParams extends Base {
    get orders(): {
      field: Extract<keyof TOrders, string>;
      direction: OrderDirection;
    }[] {
      const entries = Object.entries(type).map((e) => ({
        key: e[0],
        value: e[1],
      }));

      const orders: {
        field: Extract<keyof TOrders, string>;
        direction: OrderDirection;
      }[] = [];

      for (const { field, direction } of this.fields) {
        const found = entries.find((e) => e.value === field);

        if (!found) {
          throw new Error(`Field ${field} is not accepted as order by`);
        }

        orders.push({
          field: found.key as Extract<keyof TOrders, string>,
          direction,
        });
      }

      return orders;
    }
  };
};

/**
 * Create the order params with allowed fields to order
 *
 * @param type allowed fields to order, best to be in Typescript enum
 * @returns order params
 * @template TOrders
 */
export const CreateOrderParams = <TOrders extends Record<string, string>>(
  type: TOrders,
) => OrderParams(DefaultOrderRequestParams, type);

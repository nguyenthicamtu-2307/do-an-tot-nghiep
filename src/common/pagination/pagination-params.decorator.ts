import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { OrderDirection } from './order-query-params';
import { PaginationRequest } from './pagination-request';

/**
 * Interface designed to assign default parameters to pagination
 */
export interface DefaultPagination {
  defaultSkip?: number;
  defaultTake?: number;
  defaultOrder?: { [field: string]: OrderDirection };
  defaultOrderDirection?: OrderDirection;
  maxAllowedSize?: number;
}

/**
 * Decorator intended for building a PaginationRequest object based on the query string parameters
 */
export const PaginationParams = createParamDecorator(
  (
    data: DefaultPagination = {
      defaultSkip: 0,
      defaultTake: 50,
      defaultOrder: {},
      defaultOrderDirection: 'asc',
      maxAllowedSize: 100,
    },
    ctx: ExecutionContext,
  ): DefaultPagination & PaginationRequest => {
    const { query } = ctx.switchToHttp().getRequest();
    const { ...params } = query;

    let { skip, take, order } = query;

    const {
      defaultSkip,
      defaultTake,
      defaultOrder,
      defaultOrderDirection,
      maxAllowedSize,
    } = data;

    take = take && take > 0 ? +take : defaultTake;
    take = +take < +maxAllowedSize! ? take : maxAllowedSize;
    skip = skip && skip > 0 ? +skip : defaultSkip;

    if (order) {
      const orderArray: string[] = Array.isArray(order) ? order : [order];
      order = orderArray
        .map((x) => {
          const parts = x.split(',');
          const field = parts[0];
          const direction =
            parts.length > 1 && (parts[1] === 'asc' || parts[1] === 'desc')
              ? parts[1]
              : defaultOrderDirection;

          return { [field]: direction };
        })
        .reduce((acc, cur) => Object.assign(acc, cur), {});
    } else {
      order = defaultOrder;
    }

    return Object.assign(data, {
      skip,
      take,
      order,
      params,
    });
  },
);

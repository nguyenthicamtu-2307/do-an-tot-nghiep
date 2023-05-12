import { OrderDirection } from './order-query-params';

/**
 * Interface intended for requesting results paginated
 */
export interface PaginationRequest {
  // Number of records to skip (where the pagination shall start)
  skip?: number;

  // Number of records to take
  take?: number;

  // Sort orders
  order?: { [field: string]: OrderDirection };

  // Other params of type T
  params?: any;
}

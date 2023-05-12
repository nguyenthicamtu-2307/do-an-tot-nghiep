import { PaginatedApiResponseDto } from './paginated-response.dto';
import { PaginationRequest } from './pagination-request';

export class Pagination {
  /**
   * Return pagination response
   * @param PaginationRequest {PaginationRequest}
   * @param totalRecords {number}
   * @param dtos {t[]}
   * @returns {PaginatedApiResponseDto}
   */
  static of<T>(
    { take, skip }: PaginationRequest,
    totalRecords: number,
    dtos: T[],
  ): PaginatedApiResponseDto<T> {
    const hasNext = totalRecords > skip! + take!;

    return {
      skippedRecords: skip!,
      totalRecords,
      data: dtos,
      payloadSize: dtos.length,
      hasNext,
    };
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedApiResponseDto } from './paginated-response.dto';

@Injectable()
export class PaginatedResponseInterceptor<T>
  implements NestInterceptor<T, PaginatedApiResponseDto<T>>
{
  /**
   * Intercept the paginated response and standardize the format
   * @param _context {ExecutionContext}
   * @param next {CallHandler}
   * @returns { skippedRecords: number, totalRecords: number, data: Response<T[]>, payloadSize: number, hasNext: boolean }
   */
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedApiResponseDto<T>> {
    return next.handle().pipe(
      map((response) => {
        const { skippedRecords, totalRecords, data, payloadSize, hasNext } =
          response || {};

        return {
          skippedRecords,
          totalRecords,
          data,
          payloadSize,
          hasNext,
        };
      }),
    );
  }
}

import {
  GetAllContents,
  GetAllContentsQuery,
  GetAllContentsQueryResponse,
} from '@modules/content/application/getAllContents';
import { QueryBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('GetAllContents endpoint', () => {
  let mockQueryBus: QueryBus;
  let endpoint: GetAllContents;

  beforeEach(() => {
    mockQueryBus = mock(QueryBus);
    endpoint = new GetAllContents(instance(mockQueryBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the QueryBus', async () => {
    const response = instance(mock(GetAllContentsQueryResponse));

    when(
      mockQueryBus.execute<GetAllContentsQuery, GetAllContentsQueryResponse>(
        anyOfClass(GetAllContentsQuery),
      ),
    ).thenResolve(response);

    expect.assertions(1);

    await expect(endpoint.get()).resolves.toStrictEqual(response);

    verify(mockQueryBus.execute(anyOfClass(GetAllContentsQuery))).once();
  });

  test('should throw error when the QueryBus throws', async () => {
    const error = instance(mock(Error));

    when(
      mockQueryBus.execute<GetAllContentsQuery, GetAllContentsQueryResponse>(
        anyOfClass(GetAllContentsQuery),
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(endpoint.get()).rejects.toEqual(error);

    verify(mockQueryBus.execute(anyOfClass(GetAllContentsQuery))).once();
  });
});

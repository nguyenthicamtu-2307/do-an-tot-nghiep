import {
  GetPrivateReadUrl,
  GetPrivateReadUrlQuery,
  GetPrivateReadUrlQueryResponse,
} from '@modules/file/application/getPrivateReadUrl';
import { QueryBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('GetPrivateReadUrl endpoint', () => {
  let mockQueryBus: QueryBus;
  let endpoint: GetPrivateReadUrl;

  beforeEach(() => {
    mockQueryBus = mock(QueryBus);
    endpoint = new GetPrivateReadUrl(instance(mockQueryBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the QueryBus', async () => {
    const response = instance(mock(GetPrivateReadUrlQueryResponse));

    when(
      mockQueryBus.execute<
        GetPrivateReadUrlQuery,
        GetPrivateReadUrlQueryResponse
      >(anyOfClass(GetPrivateReadUrlQuery)),
    ).thenResolve(response);

    expect.assertions(1);

    await expect(
      endpoint.get(
        { user: { user_id: '487971f1-018d-4973-bd50-4743bd716559' } },
        { filePath: 'https://' },
      ),
    ).resolves.toStrictEqual(response);

    verify(mockQueryBus.execute(anyOfClass(GetPrivateReadUrlQuery))).once();
  });

  test('should throw error if the QueryBus throws', async () => {
    const error = instance(mock(Error));

    when(
      mockQueryBus.execute<
        GetPrivateReadUrlQuery,
        GetPrivateReadUrlQueryResponse
      >(anyOfClass(GetPrivateReadUrlQuery)),
    ).thenReject(error);

    expect.assertions(1);

    await expect(
      endpoint.get(
        { user: { user_id: '487971f1-018d-4973-bd50-4743bd716559' } },
        { filePath: 'https://' },
      ),
    ).rejects.toEqual(error);

    verify(mockQueryBus.execute(anyOfClass(GetPrivateReadUrlQuery))).once();
  });
});

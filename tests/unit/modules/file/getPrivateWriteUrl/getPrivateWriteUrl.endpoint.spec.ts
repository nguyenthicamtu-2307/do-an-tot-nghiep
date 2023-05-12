import { FileTypeEnum } from '@modules/file/application';
import {
  GetPrivateWriteUrl,
  GetPrivateWriteUrlQuery,
  GetPrivateWriteUrlQueryResponse,
} from '@modules/file/application/getPrivateWriteUrl';
import { QueryBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('GetPrivateWriteUrl endpoint', () => {
  let mockQueryBus: QueryBus;
  let endpoint: GetPrivateWriteUrl;

  const requestBody = {
    contentType: 'image/png',
    fileName: 'my-photo.jpg',
    type: FileTypeEnum.AVATARS,
  };

  beforeEach(() => {
    mockQueryBus = mock(QueryBus);
    endpoint = new GetPrivateWriteUrl(instance(mockQueryBus));
  });

  test('should execute query on the QueryBus', async () => {
    const response = instance(mock(GetPrivateWriteUrlQueryResponse));

    when(
      mockQueryBus.execute<
        GetPrivateWriteUrlQuery,
        GetPrivateWriteUrlQueryResponse
      >(anyOfClass(GetPrivateWriteUrlQuery)),
    ).thenResolve(response);

    expect.assertions(1);

    await expect(
      endpoint.get(
        { user: { user_id: '487971f1-018d-4973-bd50-4743bd716559' } },
        requestBody,
      ),
    ).resolves.toStrictEqual(response);

    verify(mockQueryBus.execute(anyOfClass(GetPrivateWriteUrlQuery))).once();
  });

  test('should throw error if the QueryBus throws', async () => {
    const error = instance(mock(Error));

    when(
      mockQueryBus.execute<
        GetPrivateWriteUrlQuery,
        GetPrivateWriteUrlQueryResponse
      >(anyOfClass(GetPrivateWriteUrlQuery)),
    ).thenReject(error);

    expect.assertions(1);

    await expect(
      endpoint.get(
        { user: { user_id: '487971f1-018d-4973-bd50-4743bd716559' } },
        requestBody,
      ),
    ).rejects.toEqual(error);

    verify(mockQueryBus.execute(anyOfClass(GetPrivateWriteUrlQuery))).once();
  });
});

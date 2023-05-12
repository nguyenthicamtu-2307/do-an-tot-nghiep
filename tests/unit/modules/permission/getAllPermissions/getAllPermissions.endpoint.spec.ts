import {
  GetAllPermissions,
  GetAllPermissionsQuery,
  GetAllPermissionsQueryResponse,
} from '@modules/permission/application/getAllPermissions';
import { QueryBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('GetAllPermissions endpoint', () => {
  let mockQueryBus: QueryBus;
  let endpoint: GetAllPermissions;

  beforeEach(() => {
    mockQueryBus = mock(QueryBus);
    endpoint = new GetAllPermissions(instance(mockQueryBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the QueryBus', async () => {
    const response = instance(mock(GetAllPermissionsQueryResponse));

    when(
      mockQueryBus.execute<
        GetAllPermissionsQuery,
        GetAllPermissionsQueryResponse
      >(anyOfClass(GetAllPermissionsQuery)),
    ).thenResolve(response);

    expect.assertions(1);

    await expect(endpoint.get()).resolves.toStrictEqual(response);

    verify(mockQueryBus.execute(anyOfClass(GetAllPermissionsQuery))).once();
  });

  test('should throw error if the QueryBus throws', async () => {
    const error = instance(mock(Error));

    when(
      mockQueryBus.execute<
        GetAllPermissionsQuery,
        GetAllPermissionsQueryResponse
      >(anyOfClass(GetAllPermissionsQuery)),
    ).thenReject(error);

    expect.assertions(1);

    await expect(endpoint.get()).rejects.toEqual(error);

    verify(mockQueryBus.execute(anyOfClass(GetAllPermissionsQuery))).once();
  });
});

import {
  GetAllRoles,
  GetAllRolesQuery,
  GetAllRolesQueryResponse,
  GetAllRolesRequestQuery,
} from '@modules/role/application/getAllRoles';
import { QueryBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('GetAllRoles endpoint', () => {
  let queryBus: QueryBus;
  let endpoint: GetAllRoles;

  const query: GetAllRolesRequestQuery = {
    skip: 0,
    take: 10,
  };

  beforeEach(() => {
    queryBus = mock(QueryBus);
    endpoint = new GetAllRoles(instance(queryBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the QueryBus', async () => {
    const response = instance(mock(GetAllRolesQueryResponse));

    when(
      queryBus.execute<GetAllRolesQuery, GetAllRolesQueryResponse>(
        anyOfClass(GetAllRolesQuery),
      ),
    ).thenResolve(response);

    expect.assertions(1);

    await expect(endpoint.get(query)).resolves.toStrictEqual(response);

    verify(queryBus.execute(anyOfClass(GetAllRolesQuery))).once();
  });

  test('should throw error if the QueryBus throws', async () => {
    const error = instance(mock(Error));

    when(
      queryBus.execute<GetAllRolesQuery, GetAllRolesQueryResponse>(
        anyOfClass(GetAllRolesQuery),
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(endpoint.get(query)).rejects.toEqual(error);

    verify(queryBus.execute(anyOfClass(GetAllRolesQuery))).once();
  });
});

import {
  GetRoleById,
  GetRoleByIdQuery,
  GetRoleByIdQueryResponse,
} from '@modules/role/application/getRoleById';
import { QueryBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('GetRoleById endpoint', () => {
  let queryBus: QueryBus;
  let endpoint: GetRoleById;

  beforeEach(() => {
    queryBus = mock(QueryBus);
    endpoint = new GetRoleById(instance(queryBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the QueryBus', async () => {
    const response = instance(mock(GetRoleByIdQueryResponse));

    when(
      queryBus.execute<GetRoleByIdQuery, GetRoleByIdQueryResponse>(
        anyOfClass(GetRoleByIdQuery),
      ),
    ).thenResolve(response);

    expect.assertions(1);

    await expect(
      endpoint.get({ id: '487971f1-018d-4973-bd50-4743bd716559' }),
    ).resolves.toStrictEqual(response);

    verify(queryBus.execute(anyOfClass(GetRoleByIdQuery))).once();
  });

  test('should throw error if the QueryBus throws', async () => {
    const error = instance(mock(Error));

    when(
      queryBus.execute<GetRoleByIdQuery, GetRoleByIdQueryResponse>(
        anyOfClass(GetRoleByIdQuery),
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(
      endpoint.get({ id: '487971f1-018d-4973-bd50-4743bd716559' }),
    ).rejects.toEqual(error);

    verify(queryBus.execute(anyOfClass(GetRoleByIdQuery))).once();
  });
});

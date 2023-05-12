import {
  UpdateRole,
  UpdateRoleCommand,
  UpdateRoleRequestBody,
} from '@modules/role/application/updateRole';
import { CommandBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('UpdateRole endpoint', () => {
  let commandBus: CommandBus;
  let endpoint: UpdateRole;

  const requestBody: UpdateRoleRequestBody = {
    name: 'Test Role',
    description: 'Role description',
    permissions: [1, 2, 3],
  };

  beforeEach(() => {
    commandBus = mock(CommandBus);
    endpoint = new UpdateRole(instance(commandBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the CommandBus', async () => {
    when(
      commandBus.execute<UpdateRoleCommand, void>(
        anyOfClass(UpdateRoleCommand),
      ),
    ).thenResolve(undefined);

    expect.assertions(1);

    await expect(
      endpoint.update(
        { id: '487971f1-018d-4973-bd50-4743bd716559' },
        requestBody,
      ),
    ).resolves.toBeUndefined();

    verify(commandBus.execute(anyOfClass(UpdateRoleCommand))).once();
  });

  test('should throw error if the CommandBus throws', async () => {
    const error = instance(mock(Error));

    when(
      commandBus.execute<UpdateRoleCommand, void>(
        anyOfClass(UpdateRoleCommand),
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(
      endpoint.update(
        { id: '487971f1-018d-4973-bd50-4743bd716559' },
        requestBody,
      ),
    ).rejects.toEqual(error);

    verify(commandBus.execute(anyOfClass(UpdateRoleCommand))).once();
  });
});

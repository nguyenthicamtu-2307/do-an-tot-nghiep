import {
  DeleteRole,
  DeleteRoleCommand,
} from '@modules/role/application/deleteRole';
import { CommandBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('DeleteRole endpoint', () => {
  let commandBus: CommandBus;
  let endpoint: DeleteRole;

  beforeEach(() => {
    commandBus = mock(CommandBus);
    endpoint = new DeleteRole(instance(commandBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the CommandBus', async () => {
    when(
      commandBus.execute<DeleteRoleCommand, void>(
        anyOfClass(DeleteRoleCommand),
      ),
    ).thenResolve(undefined);

    expect.assertions(1);

    await expect(
      endpoint.delete({ id: '487971f1-018d-4973-bd50-4743bd716559' }),
    ).resolves.toBeUndefined();

    verify(commandBus.execute(anyOfClass(DeleteRoleCommand))).once();
  });

  test('should throw error if the CommandBus throws', async () => {
    const error = instance(mock(Error));

    when(
      commandBus.execute<DeleteRoleCommand, void>(
        anyOfClass(DeleteRoleCommand),
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(
      endpoint.delete({ id: '487971f1-018d-4973-bd50-4743bd716559' }),
    ).rejects.toEqual(error);

    verify(commandBus.execute(anyOfClass(DeleteRoleCommand))).once();
  });
});

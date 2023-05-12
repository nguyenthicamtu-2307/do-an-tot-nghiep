import {
  CreateRole,
  CreateRoleCommand,
  CreateRoleRequestBody,
} from '@modules/role/application/createRole';
import { CommandBus } from '@nestjs/cqrs';
import { anyOfClass, instance, mock, verify, when } from 'ts-mockito';

describe('CreateRole endpoint', () => {
  let commandBus: CommandBus;
  let endpoint: CreateRole;

  const requestBody: CreateRoleRequestBody = {
    name: 'Test Role',
    description: 'Role description',
    permissions: [1, 2, 3],
  };

  beforeEach(() => {
    commandBus = mock(CommandBus);
    endpoint = new CreateRole(instance(commandBus));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should execute query on the CommandBus', async () => {
    when(
      commandBus.execute<CreateRoleCommand, void>(
        anyOfClass(CreateRoleCommand),
      ),
    ).thenResolve(undefined);

    expect.assertions(1);

    await expect(endpoint.create(requestBody)).resolves.toBeUndefined();

    verify(commandBus.execute(anyOfClass(CreateRoleCommand))).once();
  });

  test('should throw error if the CommandBus throws', async () => {
    const error = instance(mock(Error));

    when(
      commandBus.execute<CreateRoleCommand, void>(
        anyOfClass(CreateRoleCommand),
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(endpoint.create(requestBody)).rejects.toEqual(error);

    verify(commandBus.execute(anyOfClass(CreateRoleCommand))).once();
  });
});

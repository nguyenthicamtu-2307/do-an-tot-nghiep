import { GetRoleByIdRequestParam } from '@modules/role/application/getRoleById';
import { validateOrReject } from 'class-validator';

describe('GetRoleByIdRequestParam', () => {
  test('should require ID as UUID', async () => {
    const param = new GetRoleByIdRequestParam();
    param.id = 'Test';
    await expect(validateOrReject(param)).rejects.toBeDefined();
  });

  test('should pass on valid param', async () => {
    const param = new GetRoleByIdRequestParam();
    param.id = '487971f1-018d-4973-bd50-4743bd716559';
    await expect(validateOrReject(param)).resolves.toBeUndefined();
  });
});

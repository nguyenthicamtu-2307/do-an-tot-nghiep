import { Permissions, PERMISSIONS_KEY } from '@dlir/nestjs-auth';
import { SystemRoleAndPermissionPermission } from '@modules/auth/guards/permissions/permissions.enum';

describe('PermissionsDecorator', () => {
  describe('Permissions', () => {
    test('should safely set permission to permission key', () => {
      const result = Permissions(SystemRoleAndPermissionPermission.CreateRole);
      expect(result.KEY).toEqual(PERMISSIONS_KEY);
    });
  });
});

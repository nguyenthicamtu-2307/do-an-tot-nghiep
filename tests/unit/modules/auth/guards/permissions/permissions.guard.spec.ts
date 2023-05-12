import { PermissionsGuard } from '@dlir/nestjs-auth';
import { SystemRoleAndPermissionPermission } from '@modules/auth/guards/permissions';
import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { instance, mock, when } from 'ts-mockito';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: {
            constructor: jest.fn(),
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('canActivate', () => {
    test('should skip(return true) if the `Permissions` decorator is not set', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockImplementation(() => undefined);
      const context = mock<ExecutionContext>();

      expect.assertions(2);

      expect(guard.canActivate(instance(context))).toBeTruthy();
      expect(reflector.getAllAndOverride).toBeCalled();
    });

    test('should return true if the `Permissions` decorator is set', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockImplementation(() => [
          SystemRoleAndPermissionPermission.CreateRole,
        ]);

      const context = mock<ExecutionContext>();
      when(context.getClass()).thenReturn({} as any);
      when(context.getHandler()).thenReturn({} as any);

      const argumentHost = mock<HttpArgumentsHost>();
      when(argumentHost.getRequest()).thenReturn({
        user: {
          permissions: JSON.stringify([
            SystemRoleAndPermissionPermission.CreateRole,
          ]),
        },
      } as any);

      when(context.switchToHttp()).thenReturn(instance(argumentHost));

      expect.assertions(2);

      expect(guard.canActivate(instance(context))).toBeTruthy();
      expect(reflector.getAllAndOverride).toBeCalled();
    });

    test('should return false if the `Permissions` decorator is set but permission is not allowed', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockImplementation(() => [
          SystemRoleAndPermissionPermission.CreateRole,
        ]);

      const context = mock<ExecutionContext>();
      when(context.getClass()).thenReturn({} as any);
      when(context.getHandler()).thenReturn({} as any);

      const argumentHost = mock<HttpArgumentsHost>();
      when(argumentHost.getRequest()).thenReturn({
        user: {
          permissions: JSON.stringify([
            SystemRoleAndPermissionPermission.ReadRole,
          ]),
        },
      } as any);

      when(context.switchToHttp()).thenReturn(instance(argumentHost));

      expect.assertions(2);

      expect(guard.canActivate(instance(context))).toBeFalsy();
      expect(reflector.getAllAndOverride).toBeCalled();
    });

    test('should return false if the `Permissions` decorator is set but user does not have permission', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockImplementation(() => [
          SystemRoleAndPermissionPermission.CreateRole,
        ]);

      const context = mock<ExecutionContext>();
      when(context.getClass()).thenReturn({} as any);
      when(context.getHandler()).thenReturn({} as any);

      const argumentHost = mock<HttpArgumentsHost>();
      when(argumentHost.getRequest()).thenReturn({
        user: {
          permissions: '',
        },
      } as any);

      when(context.switchToHttp()).thenReturn(instance(argumentHost));

      expect.assertions(2);

      expect(guard.canActivate(instance(context))).toBeFalsy();
      expect(reflector.getAllAndOverride).toBeCalled();
    });
  });
});

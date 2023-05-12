import { DeleteRoleHandler } from '@modules/role/application/deleteRole';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../../../../src/config';
import { PrismaService } from '../../../../../src/prisma';

describe('DeleteRoleHandler', () => {
  let dbContext: PrismaService;
  let handler: DeleteRoleHandler;

  const mockFindUniqueRole = {
    id: '487971f1-018d-4973-bd50-4743bd716559',
    name: 'SYSTEM_ADMINISTRATOR',
    description: 'System Administrator',
    canBeDeleted: false,
    createdAt: new Date('2022-01-19T08:10:16.388Z'),
    updatedAt: new Date('2022-01-19T08:10:16.388Z'),
    permissions: [
      {
        permission: {
          id: 1,
          resourceName: 'WEB_ADMIN',
          displayName: 'Allow to login to the web-admin',
          canCreate: false,
          canRead: true,
          canUpdate: false,
          canDelete: false,
          createdAt: new Date('2022-02-08T07:52:58.126Z'),
          updatedAt: new Date('2022-02-08T07:52:58.126Z'),
        },
      },
    ],
  };

  const mockPrismaService = {
    role: jest.fn(),
    roleToPermission: jest.fn(),
    userToRole: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        DeleteRoleHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    dbContext = module.get<PrismaService>(PrismaService);
    handler = module.get<DeleteRoleHandler>(DeleteRoleHandler);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('deleteRole', () => {
    test('should handle error when the requested role does not exist', async () => {
      dbContext.role.findUnique = jest.fn().mockResolvedValue(undefined);

      expect.assertions(2);

      await expect(
        handler.deleteRole('487971f1-018d-4973-bd50-4743bd716559'),
      ).rejects.toStrictEqual(
        new NotFoundException('The requested role does not exist.'),
      );

      expect(dbContext.role.findUnique).toHaveBeenCalledTimes(1);
    });

    test('should handle error when the requested role cannot delete', async () => {
      dbContext.role.findUnique = jest
        .fn()
        .mockResolvedValue(mockFindUniqueRole);

      expect.assertions(2);

      await expect(
        handler.deleteRole('487971f1-018d-4973-bd50-4743bd716559'),
      ).rejects.toStrictEqual(
        new BadRequestException('This role cannot be deleted.'),
      );

      expect(dbContext.role.findUnique).toHaveBeenCalledTimes(1);
    });

    test('should safely delete requested role', async () => {
      dbContext.role.findUnique = jest.fn().mockResolvedValue({
        ...mockFindUniqueRole,
        canBeDeleted: true,
      });
      dbContext.roleToPermission.deleteMany = jest.fn();
      dbContext.userToRole.deleteMany = jest.fn();
      dbContext.role.delete = jest.fn();
      //TODO: unit test transaction
      dbContext.$transaction = jest.fn();

      // expect.assertions(5);

      await expect(
        handler.deleteRole('487971f1-018d-4973-bd50-4743bd716559'),
      ).resolves.toBeUndefined();

      expect(dbContext.role.findUnique).toHaveBeenCalledTimes(1);
      // expect(dbContext.roleToPermission.deleteMany).toHaveBeenCalledTimes(1);
      // expect(dbContext.userToRole.deleteMany).toHaveBeenCalledTimes(1);
      // expect(dbContext.role.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute', () => {
    test('should safely execute DeleteRoleHandler', async () => {
      handler.deleteRole = jest.fn();

      expect.assertions(3);

      await expect(
        handler.execute({ id: '487971f1-018d-4973-bd50-4743bd716559' }),
      ).resolves.toBeUndefined();

      expect(handler.deleteRole).toHaveBeenCalledTimes(1);
      expect(handler.deleteRole).toHaveBeenCalledWith(
        '487971f1-018d-4973-bd50-4743bd716559',
      );
    });
  });
});

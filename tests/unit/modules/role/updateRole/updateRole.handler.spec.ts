import { PrismaService } from '@db';
import { UpdateRoleHandler } from '@modules/role/application/updateRole';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('UpdateRoleHandler', () => {
  let dbContext: PrismaService;
  let handler: UpdateRoleHandler;

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

  const mockFindManyPermissions = [
    {
      id: '487971f1-018d-4973-bd50-4743bd716559',
      resourceName: 'WEB_ADMIN',
      displayName: 'Allow to login to the web-admin',
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      createdAt: new Date('2022-02-08T07:52:58.126Z'),
      updatedAt: new Date('2022-02-08T07:52:58.126Z'),
    },
  ];

  const mockPrismaService = {
    role: jest.fn(),
    permission: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        UpdateRoleHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    dbContext = module.get<PrismaService>(PrismaService);
    handler = module.get<UpdateRoleHandler>(UpdateRoleHandler);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('updateRole', () => {
    test('should handle error when the requested role does not exist', async () => {
      dbContext.role.findUnique = jest.fn().mockResolvedValue(undefined);

      expect.assertions(2);

      await expect(
        handler.updateRole(
          {
            id: '487971f1-018d-4973-bd50-4743bd716559',
            name: 'Test Role',
            description: 'Users have access to BPP customer portal only.',
          },
          [1, 2, 3],
        ),
      ).rejects.toStrictEqual(
        new NotFoundException('The requested role does not exist.'),
      );

      expect(dbContext.role.findUnique).toHaveBeenCalledTimes(1);
    });

    test('should safely update requested role', async () => {
      dbContext.role.findUnique = jest
        .fn()
        .mockResolvedValue(mockFindUniqueRole);
      dbContext.permission.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyPermissions);
      dbContext.role.update = jest.fn();

      expect.assertions(4);

      await expect(
        handler.updateRole(
          {
            id: '487971f1-018d-4973-bd50-4743bd716559',
            name: 'Test Role',
            description: 'Users have access to BPP customer portal only.',
          },
          [1, 2, 3],
        ),
      ).resolves.toBeUndefined();

      expect(dbContext.role.findUnique).toHaveBeenCalledTimes(1);
      expect(dbContext.permission.findMany).toHaveBeenCalledTimes(1);
      expect(dbContext.role.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute', () => {
    test('should safely execute UpdateRoleHandler', async () => {
      handler.updateRole = jest.fn();

      expect.assertions(3);

      await expect(
        handler.execute({
          id: '487971f1-018d-4973-bd50-4743bd716559',
          body: {
            name: 'Test Role',
            description: 'Users have access to BPP customer portal only.',
            permissions: [1, 2, 3],
          },
        }),
      ).resolves.toBeUndefined();

      expect(handler.updateRole).toHaveBeenCalledTimes(1);
      expect(handler.updateRole).toHaveBeenCalledWith(
        {
          id: '487971f1-018d-4973-bd50-4743bd716559',
          name: 'Test Role',
          description: 'Users have access to BPP customer portal only.',
        },
        [1, 2, 3],
      );
    });
  });
});

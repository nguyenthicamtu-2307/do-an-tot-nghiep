import { CreateRoleHandler } from '@modules/role/application/createRole';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../../../../src/config';
import { PrismaService } from '../../../../../src/prisma';

describe('CreateRoleHandler', () => {
  let dbContext: PrismaService;
  let handler: CreateRoleHandler;

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

  const mockFindFirstRole = {
    id: '487971f1-018d-4973-bd50-4743bd716559',
    name: 'SYSTEM_ADMINISTRATOR',
    description: 'System Administrator',
    canBeDeleted: false,
    createdAt: new Date('2022-01-19T08:10:16.388Z'),
    updatedAt: new Date('2022-01-19T08:10:16.388Z'),
  };

  const mockPrismaService = {
    role: jest.fn(),
    permission: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        CreateRoleHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    dbContext = module.get<PrismaService>(PrismaService);
    handler = module.get<CreateRoleHandler>(CreateRoleHandler);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createRole', () => {
    test("should handle error if role's name already been in use", async () => {
      dbContext.role.findFirst = jest.fn().mockResolvedValue(mockFindFirstRole);

      expect.assertions(2);

      await expect(
        handler.createRole({
          name: 'Test Role',
          description: 'Users have access to BPP customer portal only.',
          permissions: [1, 2, 3],
        }),
      ).rejects.toStrictEqual(
        new BadRequestException('This role name has been used.'),
      );

      expect(dbContext.role.findFirst).toHaveBeenCalledTimes(1);
    });

    test('should safely create a role', async () => {
      dbContext.role.findFirst = jest.fn().mockResolvedValue(undefined);
      dbContext.permission.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyPermissions);
      dbContext.role.create = jest.fn().mockResolvedValue(mockFindFirstRole);

      expect.assertions(3);

      await expect(
        handler.createRole({
          name: 'Test Role',
          description: 'Users have access to BPP customer portal only.',
          permissions: [1, 2, 3],
        }),
      ).resolves.toBeUndefined();

      expect(dbContext.permission.findMany).toHaveBeenCalledTimes(1);
      expect(dbContext.role.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute', () => {
    test('should safely execute CreateRoleHandler', async () => {
      handler.createRole = jest.fn();

      expect.assertions(3);

      await expect(
        handler.execute({
          body: {
            name: 'Test Role',
            description: 'Users have access to BPP customer portal only.',
            permissions: [1, 2, 3],
          },
        }),
      ).resolves.toBeUndefined();

      expect(handler.createRole).toHaveBeenCalledTimes(1);
      expect(handler.createRole).toHaveBeenCalledWith({
        name: 'Test Role',
        description: 'Users have access to BPP customer portal only.',
        permissions: [1, 2, 3],
      });
    });
  });
});

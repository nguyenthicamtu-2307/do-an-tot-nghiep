import { PrismaService } from '@db';
import { GetRoleByIdHandler } from '@modules/role/application/getRoleById';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('GetRoleByIdHandler', () => {
  let dbContext: PrismaService;
  let handler: GetRoleByIdHandler;

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
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        GetRoleByIdHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    dbContext = module.get<PrismaService>(PrismaService);
    handler = module.get<GetRoleByIdHandler>(GetRoleByIdHandler);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getRoleById', () => {
    test('should safely handle error when role does not exist', async () => {
      dbContext.role.findUnique = jest.fn().mockResolvedValue(null);

      expect.assertions(2);

      await expect(
        handler.getRoleById('487971f1-018d-4973-bd50-4743bd716559'),
      ).rejects.toStrictEqual(
        new BadRequestException(
          'The requested role does not exist in the system.',
        ),
      );

      expect(dbContext.role.findUnique).toHaveBeenCalledTimes(1);
    });

    test('should safely return role by ID', async () => {
      dbContext.role.findUnique = jest
        .fn()
        .mockResolvedValue(mockFindUniqueRole);

      expect.assertions(2);

      await expect(
        handler.getRoleById('487971f1-018d-4973-bd50-4743bd716559'),
      ).resolves.toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          permissions: expect.arrayContaining([
            expect.objectContaining({
              permission: expect.objectContaining({
                id: expect.any(Number),
                resourceName: expect.any(String),
                displayName: expect.any(String),
                canCreate: expect.any(Boolean),
                canRead: expect.any(Boolean),
                canUpdate: expect.any(Boolean),
                canDelete: expect.any(Boolean),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
              }),
            }),
          ]),
        }),
      );

      expect(dbContext.role.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute', () => {
    test('should safely execute GetRoleByIdHandler', async () => {
      handler.getRoleById = jest
        .fn()
        .mockImplementation(() => mockFindUniqueRole);

      expect.assertions(3);

      await expect(
        handler.execute({
          id: '487971f1-018d-4973-bd50-4743bd716559',
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          canBeDeleted: expect.any(Boolean),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          permissions: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              resourceName: expect.any(String),
              displayName: expect.any(String),
              canCreate: expect.any(Boolean),
              canRead: expect.any(Boolean),
              canUpdate: expect.any(Boolean),
              canDelete: expect.any(Boolean),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            }),
          ]),
        }),
      );

      expect(handler.getRoleById).toHaveBeenCalledTimes(1);
      expect(handler.getRoleById).toHaveBeenCalledWith(
        '487971f1-018d-4973-bd50-4743bd716559',
      );
    });
  });
});

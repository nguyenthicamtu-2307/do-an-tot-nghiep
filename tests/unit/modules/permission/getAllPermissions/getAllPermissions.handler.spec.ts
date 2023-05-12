import { GetAllPermissionsHandler } from '@modules/permission/application/getAllPermissions';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../../../../../src/config';
import { PrismaService } from '../../../../../src/prisma';

describe('GetAllPermissionsHandler', () => {
  let handler: GetAllPermissionsHandler;
  let dbContext: PrismaService;

  const mockFindManyPermissions = [
    {
      id: 1,
      resourceName: 'WEB_ADMIN',
      displayName: 'Allow to login to the web-admin',
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      createdAt: new Date('2022-02-09T04:43:42.266Z'),
      updatedAt: new Date('2022-02-09T04:43:42.266Z'),
    },
  ];

  const mockPrismaService = {
    permission: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        GetAllPermissionsHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    handler = module.get<GetAllPermissionsHandler>(GetAllPermissionsHandler);
    dbContext = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getPermissions', () => {
    test('should safely get all permissions', async () => {
      dbContext.permission.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyPermissions);

      expect.assertions(2);

      await expect(handler.getPermissions()).resolves.toEqual(
        expect.arrayContaining([
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
      );

      expect(dbContext.permission.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute', () => {
    test('should safely execute GetAllPermissionsHandler', async () => {
      handler.getPermissions = jest
        .fn()
        .mockImplementation(() => mockFindManyPermissions);

      expect.assertions(2);

      await expect(handler.execute()).resolves.toEqual(
        expect.arrayContaining([
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
      );

      expect(handler.getPermissions).toHaveBeenCalledTimes(1);
    });
  });
});

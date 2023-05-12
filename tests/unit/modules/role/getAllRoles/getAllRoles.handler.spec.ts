import { PrismaService } from '@db';
import { GetAllRolesHandler } from '@modules/role/application/getAllRoles';
import { Test } from '@nestjs/testing';

describe('GetAllRolesHandler', () => {
  let dbContext: PrismaService;
  let handler: GetAllRolesHandler;

  const mockFindManyRoles = [
    {
      id: '487971f1-018d-4973-bd50-4743bd716559',
      name: 'SYSTEM_ADMINISTRATOR',
      description: 'System Administrator',
      createdAt: new Date('2022-01-19T08:10:16.388Z'),
      updatedAt: new Date('2022-01-19T08:10:16.388Z'),
    },
  ];

  const mockPrismaService = {
    role: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        GetAllRolesHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    dbContext = module.get<PrismaService>(PrismaService);
    handler = module.get<GetAllRolesHandler>(GetAllRolesHandler);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllRoles', () => {
    test('should safely return all roles', async () => {
      dbContext.role.count = jest.fn().mockResolvedValue(10);
      dbContext.role.findMany = jest.fn().mockResolvedValue(
        mockFindManyRoles.map((x) => ({
          ...x,
          _count: {
            users: 2,
          },
        })),
      );

      expect.assertions(3);

      await expect(
        handler.getAllRoles({ search: 'abcd', skip: 0, take: 10 }),
      ).resolves.toEqual({
        total: expect.any(Number),
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            _count: expect.objectContaining({
              users: expect.any(Number),
            }),
          }),
        ]),
      });

      expect(dbContext.role.count).toHaveBeenCalledTimes(1);
      expect(dbContext.role.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute', () => {
    test('should safely execute GetAllRolesHandler', async () => {
      handler.getAllRoles = jest.fn().mockImplementation(() => ({
        total: 10,
        data: mockFindManyRoles.map((x) => ({
          ...x,
          _count: {
            users: 1,
          },
        })),
      }));

      expect.assertions(3);

      await expect(
        handler.execute({
          option: {
            skip: 0,
            take: 10,
          },
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          skippedRecords: expect.any(Number),
          totalRecords: expect.any(Number),
          data: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              description: expect.any(String),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              userCount: expect.any(Number),
            }),
          ]),
          payloadSize: expect.any(Number),
          hasNext: expect.any(Boolean),
        }),
      );

      expect(handler.getAllRoles).toHaveBeenCalledTimes(1);
      expect(handler.getAllRoles).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });
  });
});

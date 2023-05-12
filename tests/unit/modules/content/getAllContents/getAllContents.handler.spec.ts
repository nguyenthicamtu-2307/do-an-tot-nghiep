import { GetAllContentsHandler } from '@modules/content/application/getAllContents';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../../../../../src/config';
import { PrismaService } from '../../../../../src/prisma';

describe('GetAllContentsHandler', () => {
  let dbContext: PrismaService;
  let handler: GetAllContentsHandler;

  // const mockArrayContentValueValidationSchema = expect.arrayContaining([
  //   expect.objectContaining({
  //     id: expect.any(Number),
  //     key: expect.any(String),
  //     name: expect.any(String),
  //     createdAt: expect.any(Date),
  //     updatedAt: expect.any(Date),
  //   }),
  // ]);

  const mockFindManyCountries = [
    {
      id: 233,
      code: 'US',
      code3: 'USA',
      name: 'United States',
      createdAt: new Date('2022-01-19T15:29:43.661Z'),
      updatedAt: new Date('2022-01-19T15:29:43.661Z'),
    },
  ];

  const mockFindManyStates = [
    {
      id: 1,
      code: 'NY',
      name: 'New York',
      createdAt: new Date('2022-01-19T15:29:43.661Z'),
      updatedAt: new Date('2022-01-19T15:29:43.661Z'),
    },
  ];

  const mockFindManyDepartments = [
    {
      id: 1,
      name: 'Department 1',
      createdAt: new Date('2022-01-19T15:29:43.661Z'),
      updatedAt: new Date('2022-01-19T15:29:43.661Z'),
    },
  ];

  const mockFindManyNotificationTypes = [
    {
      id: 1,
      name: 'Email',
      createdAt: new Date('2022-01-19T15:29:43.661Z'),
      updatedAt: new Date('2022-01-19T15:29:43.661Z'),
    },
  ];

  const mockPrismaService = {
    country: jest.fn(),
    state: jest.fn(),
    department: jest.fn(),
    notificationType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        GetAllContentsHandler,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    dbContext = module.get<PrismaService>(PrismaService);
    handler = module.get<GetAllContentsHandler>(GetAllContentsHandler);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllContents', () => {
    test('should safely get all contents', async () => {
      dbContext.country.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyCountries);
      dbContext.state.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyStates);
      dbContext.department.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyDepartments);
      dbContext.notificationType.findMany = jest
        .fn()
        .mockResolvedValue(mockFindManyNotificationTypes);

      expect.assertions(4);

      await expect(handler.getAllContents()).resolves.toEqual(
        expect.objectContaining({
          countries: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              code: expect.any(String),
              code3: expect.any(String),
              name: expect.any(String),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            }),
          ]),
          states: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              code: expect.any(String),
              name: expect.any(String),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            }),
          ]),
          departments: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            }),
          ]),
        }),
      );

      expect(dbContext.country.findMany).toHaveBeenCalledTimes(1);
      expect(dbContext.state.findMany).toHaveBeenCalledTimes(1);
      expect(dbContext.department.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute', () => {
    test('should safely execute getAllContents handler', async () => {
      handler.getAllContents = jest.fn().mockImplementation(() => []);

      expect.assertions(2);

      await expect(handler.execute()).resolves.toBeDefined();

      expect(handler.getAllContents).toHaveBeenCalledTimes(1);
    });
  });
});

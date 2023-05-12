import { CognitoAuthGuard } from '@dlir/nestjs-auth';
import { ContentModule } from '@modules/content';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ConfigModule } from '../../../../src/config';
import { PrismaService } from '../../../../src/prisma';

describe('GetAllContents', () => {
  let app: INestApplication;
  let server;

  const mockFindManyCountries = [
    {
      id: 233,
      code: 'US',
      code3: 'USA',
      name: 'United States',
      createdAt: '2022-01-19T15:29:43.661Z',
      updatedAt: '2022-01-19T15:29:43.661Z',
    },
  ];

  const mockFindManyStates = [
    {
      id: 1,
      code: 'NY',
      name: 'New York',
      createdAt: '2022-01-19T15:29:43.661Z',
      updatedAt: '2022-01-19T15:29:43.661Z',
    },
  ];

  const mockFindManyDepartments = [
    {
      id: 1,
      name: 'Department 1',
      createdAt: '2022-01-19T15:29:43.661Z',
      updatedAt: '2022-01-19T15:29:43.661Z',
    },
  ];

  const mockFindManyNotificationTypes = [
    {
      id: 1,
      name: 'Notification Email',
      description:
        'Allows BPP MS send the notification message to registered email',
      key: 'EMAIL',
      createdAt: '2022-01-19T15:29:43.661Z',
      updatedAt: '2022-01-19T15:29:43.661Z',
    },
  ];

  const apiResponse = {
    countries: mockFindManyCountries,
    states: mockFindManyStates,
    departments: mockFindManyDepartments,
    notificationTypes: mockFindManyNotificationTypes,
  };

  const mockAuthGuard = {
    canActivated: () => true,
  };

  const mockPrismaService = {
    country: {
      findMany: () => mockFindManyCountries,
    },
    state: {
      findMany: () => mockFindManyStates,
    },
    department: {
      findMany: () => mockFindManyDepartments,
    },
    notificationType: {
      findMany: () => mockFindManyNotificationTypes,
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, ContentModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideGuard(CognitoAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    server = app.getHttpServer();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  test('should safely return all contents', async () => {
    const res = await request(server).get('/contents').expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        code: 200,
        data: apiResponse,
        success: true,
        timestamp: expect.any(Number),
      }),
    );
  });
});

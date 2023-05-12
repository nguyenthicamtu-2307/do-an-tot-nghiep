import { CognitoAuthGuard, PermissionsGuard } from '@dlir/nestjs-auth';
import { RoleModule } from '@modules/role';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ConfigModule } from '../../../../src/config';
import { PrismaService } from '../../../../src/prisma';

describe('GetRoleById', () => {
  let app: INestApplication;
  let server;

  const dbRecord = {
    id: '487971f1-018d-4973-bd50-4743bd716559',
    name: 'SYSTEM_ADMINISTRATOR',
    description: 'System Administrator',
    canBeDeleted: false,
    createdAt: '2022-01-19T08:10:16.388Z',
    updatedAt: '2022-01-19T08:10:16.388Z',
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
          createdAt: '2022-02-08T07:52:58.126Z',
          updatedAt: '2022-02-08T07:52:58.126Z',
        },
      },
    ],
  };

  const apiResponse = {
    id: '487971f1-018d-4973-bd50-4743bd716559',
    name: 'SYSTEM_ADMINISTRATOR',
    description: 'System Administrator',
    canBeDeleted: false,
    createdAt: '2022-01-19T08:10:16.388Z',
    updatedAt: '2022-01-19T08:10:16.388Z',
    permissions: [
      {
        id: 1,
        resourceName: 'WEB_ADMIN',
        displayName: 'Allow to login to the web-admin',
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
        createdAt: '2022-02-08T07:52:58.126Z',
        updatedAt: '2022-02-08T07:52:58.126Z',
      },
    ],
  };

  const mockAuthGuard = {
    canActivated: () => true,
  };

  const mockPermissionsGuard = {
    canActivated: () => true,
  };

  const mockPrismaService = {
    role: {
      findUnique: () => dbRecord,
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, RoleModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideGuard(CognitoAuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(PermissionsGuard)
      .useValue(mockPermissionsGuard)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    server = app.getHttpServer();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  test('should return 400 BAD_REQUEST if the ID is invalid', async () => {
    const res = await request(server).get('/roles/1').expect(400);

    expect(res.body).toEqual(
      expect.objectContaining({
        error: 'Bad Request',
        message: ['id must be a UUID'],
        statusCode: 400,
      }),
    );
  });

  test('should safely return role by ID', async () => {
    const res = await request(server)
      .get('/roles/487971f1-018d-4973-bd50-4743bd716559')
      .expect(200);

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

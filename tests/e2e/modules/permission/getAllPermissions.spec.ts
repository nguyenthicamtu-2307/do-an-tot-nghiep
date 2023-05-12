import { CognitoAuthGuard, PermissionsGuard } from '@dlir/nestjs-auth';
import { PermissionModule } from '@modules/permission';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ConfigModule } from '../../../../src/config';
import { PrismaService } from '../../../../src/prisma';

describe('GetAllPermissions', () => {
  let app: INestApplication;
  let server;

  const dbRecord = [
    {
      id: 1,
      resourceName: 'WEB_ADMIN',
      displayName: 'Allow to login to the web-admin',
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      createdAt: '2022-02-09T04:43:42.266Z',
      updatedAt: '2022-02-09T04:43:42.266Z',
    },
  ];

  const mockAuthGuard = {
    canActivated: () => true,
  };

  const mockPermissionsGuard = {
    canActivated: () => true,
  };

  const mockPrismaService = {
    permission: {
      findMany: () => dbRecord,
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule, PermissionModule],
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

  test('should safely return all permissions', async () => {
    const res = await request(server).get('/permissions').expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        code: 200,
        data: dbRecord,
        success: true,
        timestamp: expect.any(Number),
      }),
    );
  });
});

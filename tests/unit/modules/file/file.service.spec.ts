import {
  FileConfig,
  fileConfig,
  FileService,
  FileTypeEnum,
} from '@modules/file/application';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn().mockReturnValue({
      getSignedUrlPromise: jest
        .fn()
        .mockResolvedValue('https://bucket/key/test'),
    }),
  };
});

describe('FileService', () => {
  let fileService: FileService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestConfigModule.forRoot({
          load: [fileConfig],
        }),
      ],
      providers: [FileConfig, FileService],
    }).compile();

    fileService = module.get<FileService>(FileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPrivateWriteUrl', () => {
    test('should safely get presigned url for uploading file', async () => {
      expect.assertions(1);

      await expect(
        fileService.getPrivateWriteUrl('', {
          type: FileTypeEnum.AVATARS,
          contentType: 'image/png',
          fileName: 'myphoto.png',
        }),
      ).resolves.toBe('https://bucket/key/test');
    });
  });

  describe('getPrivateReadUrl', () => {
    test('should safely get presigned url for uploading file', async () => {
      expect.assertions(1);

      await expect(
        fileService.getPrivateReadUrl('', {
          filePath: 'https://bucket/key',
        }),
      ).resolves.toBe('https://bucket/key/test');
    });
  });
});

import { FileService } from '@modules/file/application';
import {
  GetPrivateWriteUrlHandler,
  GetPrivateWriteUrlQuery,
  GetPrivateWriteUrlRequestQuery,
} from '@modules/file/application/getPrivateWriteUrl';
import { instance, mock, verify, when } from 'ts-mockito';

describe('GetPrivateWriteUrlHandler', () => {
  let mockFileService: FileService;
  let handler: GetPrivateWriteUrlHandler;

  const option: GetPrivateWriteUrlRequestQuery = {
    fileName: 'my-photo.jpg',
    contentType: 'image/png',
    type: 'string',
  };

  beforeEach(() => {
    mockFileService = mock(FileService);
    handler = new GetPrivateWriteUrlHandler(instance(mockFileService));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call FileService', async () => {
    when(
      mockFileService.getPrivateWriteUrl(
        '487971f1-018d-4973-bd50-4743bd716559',
        option,
      ),
    ).thenResolve('https://');

    expect.assertions(1);

    await expect(
      handler.execute(
        new GetPrivateWriteUrlQuery(
          '487971f1-018d-4973-bd50-4743bd716559',
          option,
        ),
      ),
    ).resolves.toEqual({ url: 'https://' });

    verify(
      mockFileService.getPrivateWriteUrl(
        '487971f1-018d-4973-bd50-4743bd716559',
        option,
      ),
    ).once();
  });

  test('should throw error if the FileService throws', async () => {
    const error = instance(mock(Error));

    when(
      mockFileService.getPrivateWriteUrl(
        '487971f1-018d-4973-bd50-4743bd716559',
        option,
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(
      handler.execute(
        new GetPrivateWriteUrlQuery(
          '487971f1-018d-4973-bd50-4743bd716559',
          option,
        ),
      ),
    ).rejects.toEqual(error);

    verify(
      mockFileService.getPrivateWriteUrl(
        '487971f1-018d-4973-bd50-4743bd716559',
        option,
      ),
    ).once();
  });
});

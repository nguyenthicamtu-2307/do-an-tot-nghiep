import { FileService } from '@modules/file/application';
import {
  GetPrivateReadUrlHandler,
  GetPrivateReadUrlQuery,
  GetPrivateReadUrlRequestQuery,
} from '@modules/file/application/getPrivateReadUrl';
import { instance, mock, verify, when } from 'ts-mockito';

describe('GetPrivateReadUrlHandler', () => {
  let mockFileService: FileService;
  let handler: GetPrivateReadUrlHandler;

  const option: GetPrivateReadUrlRequestQuery = {
    filePath: 'https://',
  };

  beforeEach(() => {
    mockFileService = mock(FileService);
    handler = new GetPrivateReadUrlHandler(instance(mockFileService));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call FileService', async () => {
    when(
      mockFileService.getPrivateReadUrl(
        '487971f1-018d-4973-bd50-4743bd716559',
        option,
      ),
    ).thenResolve('https://');

    expect.assertions(1);

    await expect(
      handler.execute(
        new GetPrivateReadUrlQuery(
          '487971f1-018d-4973-bd50-4743bd716559',
          option,
        ),
      ),
    ).resolves.toEqual({ url: 'https://' });

    verify(
      mockFileService.getPrivateReadUrl(
        '487971f1-018d-4973-bd50-4743bd716559',
        option,
      ),
    ).once();
  });

  test('should throw error if the FileService throws', async () => {
    const error = instance(mock(Error));

    when(
      mockFileService.getPrivateReadUrl(
        '487971f1-018d-4973-bd50-4743bd716559',
        option,
      ),
    ).thenReject(error);

    expect.assertions(1);

    await expect(
      handler.execute(
        new GetPrivateReadUrlQuery(
          '487971f1-018d-4973-bd50-4743bd716559',
          option,
        ),
      ),
    ).rejects.toEqual(error);

    verify(
      mockFileService.getPrivateReadUrl(
        '487971f1-018d-4973-bd50-4743bd716559',
        option,
      ),
    ).once();
  });
});

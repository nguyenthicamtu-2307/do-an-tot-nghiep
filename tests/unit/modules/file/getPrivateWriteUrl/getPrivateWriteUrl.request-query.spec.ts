import { FileTypeEnum } from '@modules/file/application';
import { GetPrivateWriteUrlRequestQuery } from '@modules/file/application/getPrivateWriteUrl';
import { validateOrReject } from 'class-validator';

describe('GetPrivateWriteUrlRequestQuery', () => {
  test.each([
    [
      'should require fileName',
      {
        contentType: 'image/png',
        type: FileTypeEnum.AVATARS,
      },
    ],
    [
      'should require contentType',
      {
        fileName: 'my-photo.jpg',
        type: FileTypeEnum.AVATARS,
      },
    ],
    [
      'should require fileName not empty',
      {
        fileName: '',
        contentType: 'image/png',
        type: FileTypeEnum.AVATARS,
      },
    ],
    [
      'should require contentType not empty',
      {
        fileName: 'my-photo.jpg',
        contentType: '',
        type: FileTypeEnum.AVATARS,
      },
    ],
    [
      'should require type is FileTypeEnum',
      {
        fileName: 'my-photo.jpg',
        contentType: 'image/png',
        type: 'string',
      },
    ],
    [
      'should require contentType',
      {
        fileName: 'my-photo.jpg',
        type: FileTypeEnum.AVATARS,
      },
    ],
  ])('%s', async (_, input) => {
    const query = new GetPrivateWriteUrlRequestQuery();
    Object.assign(query, input);

    await expect(validateOrReject(query)).rejects.toBeDefined();
  });

  test('should pass on valid query', async () => {
    const query = new GetPrivateWriteUrlRequestQuery();
    Object.assign(query, {
      fileName: 'my-photo.jpg',
      contentType: 'image/png',
      type: FileTypeEnum.AVATARS,
    });
    await expect(validateOrReject(query)).resolves.toBeUndefined();
  });
});

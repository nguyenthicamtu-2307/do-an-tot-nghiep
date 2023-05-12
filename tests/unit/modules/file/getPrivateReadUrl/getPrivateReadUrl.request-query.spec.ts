import { GetPrivateReadUrlRequestQuery } from '@modules/file/application/getPrivateReadUrl';
import { validateOrReject } from 'class-validator';

describe('GetPrivateReadUrlRequestQuery', () => {
  test('should require filePath', async () => {
    const query = new GetPrivateReadUrlRequestQuery();
    await expect(validateOrReject(query)).rejects.toBeDefined();
  });

  test('should require filePath is a url', async () => {
    const query = new GetPrivateReadUrlRequestQuery();
    query.filePath = 'abc';
    await expect(validateOrReject(query)).rejects.toBeDefined();
  });

  test('should pass on valid filePath', async () => {
    const query = new GetPrivateReadUrlRequestQuery();
    query.filePath = 'https://bppsandbox.amazonaws.com';
    await expect(validateOrReject(query)).resolves.toBeUndefined();
  });
});

import { apiConfig, ApiConfig, apiSchema } from '@config/index';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import Joi from 'joi';

describe('ApiConfig', () => {
  describe('apiSchema', () => {
    test.each([[1], [{}], [{ value: 'string' }]])(
      'should has API_PREFIX as a string',
      (value) => {
        const result = Joi.object(apiSchema).validate({
          API_PREFIX: value,
        });

        expect(result.error).toBeDefined();
      },
    );

    test.each([[1], [{}], [{ value: 'string' }]])(
      'should has API_VERSION as a string',
      (value) => {
        const result = Joi.object(apiSchema).validate({
          API_VERSION: value,
        });

        expect(result.error).toBeDefined();
      },
    );

    test('should API_PREFIX default to account-svc and API_VERSION default to v1', () => {
      const result = Joi.object(apiSchema).validate({});

      expect(result.value).toEqual({
        API_VERSION: 'v1',
        API_PREFIX: 'account-svc',
      });
    });

    test('should pass on valid config', () => {
      const result = Joi.object(apiSchema).validate({
        API_VERSION: 'v1',
        API_PREFIX: 'account-svc',
      });

      expect(result.error).toBeUndefined();
    });
  });

  test('get ApiConfig from DI provider', async () => {
    process.env.API_PREFIX = 'foo';
    process.env.API_VERSION = 'v5';

    const module = await Test.createTestingModule({
      imports: [
        NestConfigModule.forRoot({
          load: [apiConfig],
        }),
      ],
      providers: [ApiConfig],
    }).compile();

    const config = module.get<ApiConfig>(ApiConfig);

    expect(config.prefix).toBe('foo');
    expect(config.version).toBe('v5');
  });
});

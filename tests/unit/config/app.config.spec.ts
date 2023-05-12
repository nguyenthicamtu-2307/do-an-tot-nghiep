// import { appConfig, AppConfig, appSchema } from '@config';
import { AppConfig, appConfig, appSchema } from '@config/index';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import Joi from 'joi';

describe('AppConfig', () => {
  describe('appSchema', () => {
    test.each([
      ['local', true],
      ['development', true],
      ['test', true],
      ['staging', true],
      ['production', true],
      ['foo', false],
      [{}, false],
    ])(
      'should validate environment name %s, %s',
      (env: string, valid: boolean) => {
        const result = Joi.object(appSchema).validate({
          NODE_ENV: env,
        });

        expect(result.error === undefined).toBe(valid);
      },
    );

    test.each([[1], [{}], [{ value: 'string' }]])(
      'should has APP_NAME as a string',
      (value) => {
        const result = Joi.object(appSchema).validate({
          APP_NAME: value,
        });

        expect(result.error).toBeDefined();
      },
    );

    test.each([['port'], [{}], [{ value: 1 }]])(
      'should has APP_PORT as a number or numeric string',
      (value) => {
        const result = Joi.object(appSchema).validate({
          APP_PORT: value,
        });

        expect(result.error).toBeDefined();
      },
    );

    test.each([[1], [{}], [{ value: 'string' }]])(
      'should has SERVICE_NAME as a string',
      (value) => {
        const result = Joi.object(appSchema).validate({
          SERVICE_NAME: value,
        });

        expect(result.error).toBeDefined();
      },
    );

    test('should NODE_ENV default to development, APP_NAME default to NestJS App, APP_PORT default to 5000 and SERVICE_NAME default to account-services', () => {
      const result = Joi.object(appSchema).validate({});

      expect(result.value).toEqual({
        NODE_ENV: 'development',
        APP_NAME: 'NestJS App',
        APP_PORT: 5000,
        SERVICE_NAME: 'account-services',
        SCHEMA_NAME: 'public',
      });
    });

    test('should pass on valid config', () => {
      const result = Joi.object(appSchema).validate({
        NODE_ENV: 'development',
        APP_NAME: 'NestJS App',
        APP_PORT: 5000,
        SERVICE_NAME: 'account-services',
        AWS_SNS_ACCOUNT_SERVICE_EVENT_TOPIC_ARN: 'arn:aws:sns:us-west-2:',
      });

      expect(result.error).toBeUndefined();
    });

    test.each([[1], [{}], [{ value: 'string' }]])(
      'should has AWS_SNS_ACCOUNT_SERVICE_EVENT_TOPIC_ARN as a string',
      (value) => {
        const result = Joi.object(appSchema).validate({
          AWS_SNS_ACCOUNT_SERVICE_EVENT_TOPIC_ARN: value,
        });

        expect(result.error).toBeDefined();
      },
    );

    test.each([[1], [{}], [{ value: 'string' }]])(
      'should has AWS_SQS_ACCOUNT_SERVICE_EVENT_QUEUE_URL as a string',
      (value) => {
        const result = Joi.object(appSchema).validate({
          AWS_SQS_ACCOUNT_SERVICE_EVENT_QUEUE_URL: value,
        });

        expect(result.error).toBeDefined();
      },
    );

    test.each([[1], [{}], [{ value: 'string' }]])(
      'should has AWS_SQS_ACCOUNT_SERVICE_EVENT_DLQ_URL as a string',
      (value) => {
        const result = Joi.object(appSchema).validate({
          AWS_SQS_ACCOUNT_SERVICE_EVENT_DLQ_URL: value,
        });

        expect(result.error).toBeDefined();
      },
    );
  });

  test('get AppConfig from DI provider', async () => {
    process.env.APP_NAME = 'User API';
    process.env.APP_PORT = '5000';
    process.env.NODE_ENV = 'local';
    process.env.SERVICE_NAME = 'account-services';
    process.env.AWS_SNS_ACCOUNT_SERVICE_EVENT_TOPIC_ARN =
      'arn:aws:sns:us-west-2:';
    process.env.AWS_SQS_ACCOUNT_SERVICE_EVENT_QUEUE_URL =
      'https://sqs.us-west-2.amazonaws.com/';
    process.env.AWS_SQS_ACCOUNT_SERVICE_EVENT_DLQ_URL =
      'https://sqs.us-west-2.amazonaws.com/';

    const module = await Test.createTestingModule({
      imports: [
        NestConfigModule.forRoot({
          load: [appConfig],
        }),
      ],
      providers: [AppConfig],
    }).compile();

    const config = module.get<AppConfig>(AppConfig);

    expect(config.name).toBe('User API');
    expect(config.port).toBe(5000);
    expect(config.env).toBe('local');
    expect(config.serviceName).toBe('account-services');
    expect(config.userTopicArn).toBe('arn:aws:sns:us-west-2:');
    expect(config.userQueueUrl).toBe('https://sqs.us-west-2.amazonaws.com/');
    expect(config.userDlqUrl).toBe('https://sqs.us-west-2.amazonaws.com/');
    expect(config.isLocal).toBe(true);
    expect(config.isProduction).toBe(false);
  });
});

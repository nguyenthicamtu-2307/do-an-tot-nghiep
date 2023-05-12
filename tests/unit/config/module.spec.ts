import { ApiConfig, AppConfig, ConfigModule } from '@config/index';
import { Test } from '@nestjs/testing';

describe('ConfigModule', () => {
  test('load ConfigModule successfully', async () => {
    process.env.API_PREFIX = 'foo';
    process.env.API_VERSION = 'v5';

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
    process.env.DATABASE_URL = 'localhost';
    process.env.SCHEMA_NAME = 'schema';

    process.env.WORKFLOW_SERVICE_API_URL = 'workflow_url';
    process.env.WORKFLOW_SERVICE_API_KEY = 'workflow_key';
    process.env.TEMPORAL_ADDRESS = 'temporal_url';

    const module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    const apiConfig = module.get<ApiConfig>(ApiConfig);
    const appConfig = module.get<AppConfig>(AppConfig);

    expect(apiConfig.prefix).toBe('foo');
    expect(apiConfig.version).toBe('v5');

    expect(appConfig.name).toBe('User API');
    expect(appConfig.port).toBe(5000);
    expect(appConfig.env).toBe('local');
    expect(appConfig.serviceName).toBe('account-services');
    expect(appConfig.userTopicArn).toBe('arn:aws:sns:us-west-2:');
    expect(appConfig.userQueueUrl).toBe('https://sqs.us-west-2.amazonaws.com/');
    expect(appConfig.userDlqUrl).toBe('https://sqs.us-west-2.amazonaws.com/');
    expect(appConfig.databaseUrl).toBe('localhost');
    expect(appConfig.schemaName).toBe('schema');
    expect(appConfig.isLocal).toBe(true);
    expect(appConfig.isProduction).toBe(false);
  });
});

import { EventNameEnum, EventSourceEnum } from '@events/event';
import { SNSEventService } from '@events/snsEvent.service';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SNS } from 'aws-sdk';
import { AppConfig, appConfig } from 'src/config';
import { VerifyTokenOnlineBusinessOnlineIdEvent } from './../../../../src/events/verifyTokenOnlineBusinessOnlineIdEvent';

jest.mock('aws-sdk');

describe('SNSEventService', () => {
  let snsEventService: SNSEventService;

  const mockSNS = async (
    method: keyof typeof SNS.prototype,
    value: unknown,
    isError = false,
  ) => {
    // eslint-disable-next-line security/detect-object-injection
    (SNS.prototype as unknown as object)[method] = !isError
      ? jest.fn().mockReturnValue({
          promise: jest.fn().mockResolvedValue(value),
        })
      : jest.fn().mockReturnValue({
          promise: jest.fn().mockRejectedValue(value),
        });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NestConfigModule.forRoot({
          load: [appConfig],
        }),
      ],
      providers: [SNSEventService, AppConfig],
    }).compile();

    snsEventService = module.get<SNSEventService>(SNSEventService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('publish', () => {
    test('should handler error', async () => {
      mockSNS(
        'publish',
        {
          TopicArn: 'userTopicArn',
          MessageAttributes: {
            event: {
              DataType: 'String',
              StringValue: EventNameEnum.VERIFY_TOKEN_ONLINE_BUSINESS_ID,
            },
            source: {
              DataType: 'String',
              StringValue: EventSourceEnum.ACCOUNT_SERVICE,
            },
          },
          Message: JSON.stringify({
            token: '115176d7-2d27-4ee3-9f43-47c4eeb02d1e',
            uiAccountNumber: '12345678',
            employerName: 'John Davolta',
            userFullName: 'Taylor Swift',
            email: 'test@dh.com',
          }),
        },
        true,
      );

      expect.assertions(2);
      await expect(
        snsEventService.publish(
          new VerifyTokenOnlineBusinessOnlineIdEvent({
            token: '115176d7-2d27-4ee3-9f43-47c4eeb02d1e',
            uiAccountNumber: '12345678',
            employerName: 'John Davolta',
            userFullName: 'Taylor Swift',
            email: 'test@dh.com',
          }),
        ),
      ).rejects.toStrictEqual(
        new InternalServerErrorException(
          `Failed to publish event: ${EventNameEnum.VERIFY_TOKEN_ONLINE_BUSINESS_ID}`,
        ),
      );
      expect(SNS.prototype.publish).toHaveBeenCalledTimes(1);
    });

    test('should safely publish an event', async () => {
      mockSNS('publish', {
        TopicArn: 'userTopicArn',
        MessageAttributes: {
          event: {
            DataType: 'String',
            StringValue: EventNameEnum.VERIFY_TOKEN_ONLINE_BUSINESS_ID,
          },
          source: {
            DataType: 'String',
            StringValue: EventSourceEnum.ACCOUNT_SERVICE,
          },
        },
        Message: JSON.stringify({
          token: '115176d7-2d27-4ee3-9f43-47c4eeb02d1e',
          uiAccountNumber: '12345678',
          employerName: 'John Davolta',
          userFullName: 'Taylor Swift',
          email: 'test@dh.com',
        }),
      });

      expect.assertions(2);
      await expect(
        snsEventService.publish(
          new VerifyTokenOnlineBusinessOnlineIdEvent({
            token: '115176d7-2d27-4ee3-9f43-47c4eeb02d1e',
            uiAccountNumber: '12345678',
            employerName: 'John Davolta',
            userFullName: 'Taylor Swift',
            email: 'test@dh.com',
          }),
        ),
      ).resolves.toBeUndefined();
      expect(SNS.prototype.publish).toHaveBeenCalledTimes(1);
    });
  });
});

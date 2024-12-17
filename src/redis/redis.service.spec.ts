import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

describe('RedisService', () => {
  let redisService: RedisService;
  let redisClient: Redis;

  const mockRedisClient = {
    ping: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: 'REDIS_CLIENT', useValue: mockRedisClient },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    redisClient = module.get<Redis>('REDIS_CLIENT');
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
  });

  it('should ping Redis', async () => {
    mockRedisClient.ping.mockResolvedValue('PONG');

    const result = await redisService.ping();
    expect(result).toBe('PONG');
    expect(mockRedisClient.ping).toHaveBeenCalled();
  });

  it('should set a value in Redis', async () => {
    await redisService.setValue('key1', 'value1');
    expect(mockRedisClient.set).toHaveBeenCalledWith('key1', 'value1');
  });

  it('should get a value from Redis', async () => {
    mockRedisClient.get.mockResolvedValue('value1');

    const result = await redisService.getValue('key1');
    expect(result).toBe('value1');
    expect(mockRedisClient.get).toHaveBeenCalledWith('key1');
  });

  it('should delete a value from Redis', async () => {
    mockRedisClient.del.mockResolvedValue(1);

    const result = await redisService.deleteValue('key1');
    expect(result).toBe(1);
    expect(mockRedisClient.del).toHaveBeenCalledWith('key1');
  });

  it('should get all keys from Redis', async () => {
    mockRedisClient.keys.mockResolvedValue(['key1', 'key2']);

    const result = await redisService.getKeys('*');
    expect(result).toEqual(['key1', 'key2']);
    expect(mockRedisClient.keys).toHaveBeenCalledWith('*');
  });
});

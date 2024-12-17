import { Test, TestingModule } from '@nestjs/testing';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';

describe('RedisController', () => {
  let redisController: RedisController;
  let mockRedisService: Partial<RedisService>;

  beforeEach(async () => {
    mockRedisService = {
      ping: jest.fn().mockResolvedValue('PONG'),
      setValue: jest.fn().mockResolvedValue(undefined),
      getValue: jest.fn().mockResolvedValue('value1'),
      updateValue: jest.fn().mockResolvedValue('updatedValue'),
      deleteValue: jest.fn().mockResolvedValue(1), // 1 indicates a successful deletion
      getKeys: jest.fn().mockResolvedValue(['key1', 'key2']),
      getKeyValuePairs: jest.fn().mockResolvedValue([{ key: 'key1', value: 'value1' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisController],
      providers: [{ provide: RedisService, useValue: mockRedisService }],
    }).compile();

    redisController = module.get<RedisController>(RedisController);
  });

  it('should be defined', () => {
    expect(redisController).toBeDefined();
  });

  describe('ping', () => {
    it('should return the status of the Redis server', async () => {
      const result = await redisController.ping();
      expect(result).toEqual({ status: 'PONG' });
      expect(mockRedisService.ping).toHaveBeenCalled();
    });
  });

  describe('setValue', () => {
    it('should set a value in Redis', async () => {
      const data = { key: 'key1', value: 'value1' };
      const result = await redisController.setValue(data);
      expect(result).toEqual(data);
      expect(mockRedisService.setValue).toHaveBeenCalledWith(data.key, data.value);
    });
  });

  describe('getValue', () => {
    it('should get a value from Redis', async () => {
      const result = await redisController.getValue('key1', 'name1', 'value1');
      expect(result).toEqual({
        key: 'key1',
        redisValue: 'value1',
        queryParams: { name: 'name1', value: 'value1' },
      });
      expect(mockRedisService.getValue).toHaveBeenCalledWith('key1');
    });
  });

  describe('updateValue', () => {
    it('should update a value in Redis', async () => {
      const result = await redisController.updateValue('key1', 'updatedValue');
      expect(result).toEqual({ key: 'key1', updatedValue: 'updatedValue' });
      expect(mockRedisService.updateValue).toHaveBeenCalledWith('key1', 'updatedValue');
    });
  });

  describe('deleteValue', () => {
    it('should delete a value from Redis', async () => {
      const result = await redisController.deleteValue('key1');
      expect(result).toEqual({ message: 'Key "key1" deleted successfully.' });
      expect(mockRedisService.deleteValue).toHaveBeenCalledWith('key1');
    });

    it('should return a message if the key is not found', async () => {
      (mockRedisService.deleteValue as jest.Mock).mockResolvedValue(0); // 0 indicates key not found
      const result = await redisController.deleteValue('key1');
      expect(result).toEqual({ message: 'Key "key1" not found.' });
    });
  });

  describe('getAllKeys', () => {
    it('should get all keys from Redis', async () => {
      const result = await redisController.getAllKeys('*');
      expect(result).toEqual({ keys: ['key1', 'key2'] });
      expect(mockRedisService.getKeys).toHaveBeenCalledWith('*');
    });
  });

  describe('getKeyValuePairs', () => {
    it('should get all key-value pairs matching a pattern', async () => {
      const result = await redisController.getKeyValuePairs('*');
      expect(result).toEqual({ keyValuePairs: [{ key: 'key1', value: 'value1' }] });
      expect(mockRedisService.getKeyValuePairs).toHaveBeenCalledWith('*');
    });
  });
});

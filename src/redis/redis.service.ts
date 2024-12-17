import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async ping(): Promise<string> {
    return this.redisClient.ping();
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async getValue(key: string,): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async updateValue(key: string, value: string): Promise<string> {
    const existingValue = await this.redisClient.get(key);
    if (!existingValue) {
      throw new Error(`Key "${key}" does not exist in Redis.`);
    }
    await this.redisClient.set(key, value); 
    return value;
  }

  async deleteValue(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async getKeys(pattern: string): Promise<string[]> {
    console.log('Fetching keys with pattern:', pattern); 
    return this.redisClient.keys(pattern);
  }
  
  async getKeyValuePairs(pattern: string): Promise<{ key: string; value: string | null }[]> {
    const keys = await this.redisClient.keys(pattern); 
    const keyValuePairs = await Promise.all(
      keys.map(async (key) => {
        const value = await this.redisClient.get(key); 
        return { key, value };
      }),
    );
    return keyValuePairs;
  }
}

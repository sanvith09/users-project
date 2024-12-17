import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(private readonly redisService: RedisService) {}

  async ping(): Promise<string> {
    return this.redisService.ping();
  }

  async addUserdetails(id: string, name: string): Promise<{ id: string; name: string }> {
    await this.redisService.setValue(id, name);
    return { id, name };
  }

  async getUser(id: string): Promise<{ id: string; name: string }> {
    const name = await this.redisService.getValue(id);
    if (!name) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return { id, name };
  }

  async getAllUsers(): Promise<{ id: string; name: string }[]> {
    const keys = await this.redisService.getKeys('*');
    const users = await Promise.all(
      keys.map(async (key) => {
        const value = await this.redisService.getValue(key);
        return { id: key, name: value };
      }),
    );
    return users;
  }

  async updateUser(id: string, name: string): Promise<{ id: string; name: string }> {
    const exists = await this.redisService.getValue(id);
    if (!exists) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    await this.redisService.setValue(id, name);
    return { id, name };
  }

  async deleteUser(id: string): Promise<{ id: string }> {
    const result = await this.redisService.deleteValue(id);
    if (result === 0) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return { id };
  }

  async getAllKeys(pattern: string): Promise<string[]> {
    try {
      return await this.redisService.getKeys(pattern);
    } catch (error) {
      console.error('Error fetching keys from Redis:', error);
      throw error;
    }
  }

  async getKeyValuePairs(pattern: string): Promise<{ id: string; name: string | null }[]> {
    const keys = await this.redisService.getKeys(pattern);
    const keyValuePairs = await Promise.all(
      keys.map(async (key) => {
        const value = await this.redisService.getValue(key);
        return { id: key, name: value };
      }),
    );
    return keyValuePairs;
  }
}

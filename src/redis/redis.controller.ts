import { Controller, Get, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get('ping')
  async ping() {
    return { status: await this.redisService.ping() };
  }

  @Post('setvalue')
  async setValue(@Body() data: { key: string; value: string }) {
    await this.redisService.setValue(data.key, data.value);
    return { key: data.key, value: data.value };
  }
  
  @Get('getvalue/:key')
  async getValue(
    @Param('key') key: string,
    @Query('name') name?: string, 
    @Query('value') value?: string 
  ) {
    const redisValue = await this.redisService.getValue(key); 
    console.log('Redis Value:', redisValue);
    return {
      key,           
      redisValue,   
      queryParams: { name, value }, 
    };
  }
  

@Put('updatevalue/:key')
  async updateValue(
    @Param('key') key: string,
    @Body('value') value: string
  ) {
    const redisValue = await this.redisService.updateValue(key, value);
    return { key, updatedValue: redisValue};
  }

  @Delete('deletevalue/:key')
  async deleteValue(@Param('key') key: string) {
    const result = await this.redisService.deleteValue(key);
    if (result === 0) {
      return { message: `Key "${key}" not found.` };
    }
    return { message: `Key "${key}" deleted successfully.` };
  }

  @Get('keys')
  async getAllKeys(@Query('pattern') pattern: string) {
    const keys = await this.redisService.getKeys(pattern || '*');
    return { keys }; 
  }

  @Get('getpair')
  async getKeyValuePairs(@Query('pattern') pattern: string = '*') {
    const keyValuePairs = await this.redisService.getKeyValuePairs(pattern);
    return { keyValuePairs }; 
  }

}

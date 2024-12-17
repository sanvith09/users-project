import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import Redis from 'ioredis';  

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',  
      useFactory: () => {
       
        return new Redis({
          host: 'localhost',  
          port: 6379,         
        });
      },
    },
    RedisService,
  ],
  controllers: [RedisController],
  exports: [RedisService],  
})
export class RedisModule {}

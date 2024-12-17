import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single', 
      url: 'redis://127.0.0.1:6379', 
    }),
    UsersModule,
  ],
})
export class AppModule {}

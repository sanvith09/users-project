import { Controller, Post, Get, Param, Query, Body, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('ping')
  async ping() {
    return { status: await this.usersService.ping() };
  }

  @Post('setvalue')
  async setValue(@Body() user: { id: string; name: string }) {
    await this.usersService.addUserdetails(user.id, user.name);
    return { id: user.id, name: user.name };
  }

  @Get('getvalue/:id')
  async getValue(@Param('id') id: string, @Query('name') name?: string) {
    const userName = await this.usersService.getUser(id);
    return { id, userName, queryParams: { name } };
  }

  @Put('updatevalue/:id')
  async updateValue(
    @Param('id') id: string,
    @Body() user: { name: string },
  ) {
    const updatedUser = await this.usersService.updateUser(id, user.name);
    return { id, updatedValue: updatedUser };
  }

  @Delete('deletevalue/:id')
  async deleteValue(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return {message: `deleted ${JSON.stringify(result)}`};
  }

  @Get('keys')
  async getAllKeys(@Query('pattern') pattern: string) {
    const keys = await this.usersService.getAllKeys(pattern || '*');
    return { keys };
  }

  @Get('getpair')
  async getKeyValuePairs(@Query('pattern') pattern: string = '*') {
    const keyValuePairs = await this.usersService.getKeyValuePairs(pattern);
    return { keyValuePairs };
  }
}

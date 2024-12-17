import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { RedisService } from '../redis/redis.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let redisService: RedisService;

  const mockRedisService = {
    setValue: jest.fn(),
    getValue: jest.fn(),
    deleteValue: jest.fn(),
    getKeys: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should add user details', async () => {
    const user = { id: '1', name: 'Sanvith' };
    await usersService.addUserdetails(user.id, user.name);
    expect(mockRedisService.setValue).toHaveBeenCalledWith(user.id, user.name);
  });

  it('should get user details', async () => {
    const user = { id: '1', name: 'Sanvith' };
    mockRedisService.getValue.mockResolvedValue(user.name);

    const result = await usersService.getUser(user.id);
    expect(result).toEqual(user);
    expect(mockRedisService.getValue).toHaveBeenCalledWith(user.id);
  });

  it('should get all users', async () => {
    const keys = ['1'];
    const users = [{ id: '1', name: 'Sanvith' }];
    mockRedisService.getKeys.mockResolvedValue(keys);
    mockRedisService.getValue.mockResolvedValue('Sanvith');

    const result = await usersService.getAllUsers();
    expect(result).toEqual(users);
    expect(mockRedisService.getKeys).toHaveBeenCalledWith('*');
  });

  it('should update user details', async () => {
    const user = { id: '1', name: 'Sanvith' };
    mockRedisService.getValue.mockResolvedValue('Sanvith');

    const result = await usersService.updateUser(user.id, user.name);
    expect(result).toEqual(user);
    expect(mockRedisService.setValue).toHaveBeenCalledWith(user.id, user.name);
  });

  it('should delete user', async () => {
    const userId = '1';
    mockRedisService.deleteValue.mockResolvedValue(1);

    const result = await usersService.deleteUser(userId);
    expect(result).toEqual({ id: userId });
    expect(mockRedisService.deleteValue).toHaveBeenCalledWith(userId);
  });
});

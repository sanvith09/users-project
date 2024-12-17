import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      ping: jest.fn().mockResolvedValue('PONG'),
      addUserdetails: jest.fn().mockResolvedValue(undefined),
      getUser: jest.fn().mockResolvedValue({ id: '123', name: 'John Doe' }),
      updateUser: jest.fn().mockResolvedValue('Updated Name'),
      deleteUser: jest.fn().mockResolvedValue({ id: '123', name: 'John Doe' }),
      getAllKeys: jest.fn().mockResolvedValue(['key1', 'key2']),
      getKeyValuePairs: jest.fn().mockResolvedValue([{ key: 'id1', value: 'John Doe' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('ping', () => {
    it('should return the status of the service', async () => {
      const result = await usersController.ping();
      expect(result).toEqual({ status: 'PONG' });
      expect(mockUsersService.ping).toHaveBeenCalled();
    });
  });

  describe('setValue', () => {
    it('should add user details', async () => {
      const user = { id: '123', name: 'John Doe' };
      const result = await usersController.setValue(user);
      expect(result).toEqual(user);
      expect(mockUsersService.addUserdetails).toHaveBeenCalledWith(user.id, user.name);
    });
  });

  describe('getValue', () => {
    it('should get user details by ID', async () => {
      const result = await usersController.getValue('123', 'John');
      expect(result).toEqual({
        id: '123',
        userName: { id: '123', name: 'John Doe' },
        queryParams: { name: 'John' },
      });
      expect(mockUsersService.getUser).toHaveBeenCalledWith('123');
    });
  });

  describe('updateValue', () => {
    it('should update user details', async () => {
      const result = await usersController.updateValue('123', { name: 'Updated Name' });
      expect(result).toEqual({ id: '123', updatedValue: 'Updated Name' });
      expect(mockUsersService.updateUser).toHaveBeenCalledWith('123', 'Updated Name');
    });
  });

  describe('deleteValue', () => {
    it('should delete a user by ID', async () => {
      const result = await usersController.deleteValue('123');
      expect(result).toEqual({ message: 'deleted {"id":"123","name":"John Doe"}' });
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith('123');
    });
  });

  describe('getAllKeys', () => {
    it('should get all user keys', async () => {
      const result = await usersController.getAllKeys('*');
      expect(result).toEqual({ keys: ['key1', 'key2'] });
      expect(mockUsersService.getAllKeys).toHaveBeenCalledWith('*');
    });
  });

  describe('getKeyValuePairs', () => {
    it('should get all key-value pairs', async () => {
      const result = await usersController.getKeyValuePairs('*');
      expect(result).toEqual({ keyValuePairs: [{ key: 'id1', value: 'John Doe' }] });
      expect(mockUsersService.getKeyValuePairs).toHaveBeenCalledWith('*');
    });
  });
});

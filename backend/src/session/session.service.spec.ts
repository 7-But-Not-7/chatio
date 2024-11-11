import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { RedisClientType } from 'redis';

describe('SessionService', () => {
  let service: SessionService;
  let redisClientMock: Partial<RedisClientType>;

  beforeEach(async () => {
    redisClientMock = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: 'REDIS_SESSION', useValue: redisClientMock },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set a session', async () => {
    const key = 'testKey';
    const value = { user: 'testUser' };
    const ttl = 3600;

    await service.setSession(key, value, ttl);

    expect(redisClientMock.set).toHaveBeenCalledWith(key, JSON.stringify(value), { EX: ttl });
  });

  it('should get a session', async () => {
    const key = 'testKey';
    const value = { user: 'testUser' };

    (redisClientMock.get as jest.Mock).mockResolvedValue(JSON.stringify(value));

    const result = await service.getSession(key);

    expect(result).toEqual(value);
    expect(redisClientMock.get).toHaveBeenCalledWith(key);
  });

  it('should return null if session does not exist', async () => {
    const key = 'nonExistentKey';

    (redisClientMock.get as jest.Mock).mockResolvedValue(null);

    const result = await service.getSession(key);

    expect(result).toBeNull();
    expect(redisClientMock.get).toHaveBeenCalledWith(key);
  });

  it('should delete a session', async () => {
    const key = 'testKey';

    await service.deleteSession(key);

    expect(redisClientMock.del).toHaveBeenCalledWith(key);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            reset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a value from the cache', async () => {
    const key = 'testKey';
    const value = 'testValue';
    jest.spyOn(cacheManager, 'get').mockResolvedValue(value);

    const result = await service.get<string>(key);
    expect(result).toBe(value);
    expect(cacheManager.get).toHaveBeenCalledWith(key);
  });

  it('should set a value in the cache', async () => {
    const key = 'testKey';
    const value = 'testValue';
    const ttl = 60;

    await service.set(key, value, ttl);
    expect(cacheManager.set).toHaveBeenCalledWith(key, value, ttl);
  });

  it('should delete a value from the cache', async () => {
    const key = 'testKey';

    await service.del(key);
    expect(cacheManager.del).toHaveBeenCalledWith(key);
  });

  it('should reset the cache', async () => {
    await service.reset();
    expect(cacheManager.reset).toHaveBeenCalled();
  });
});

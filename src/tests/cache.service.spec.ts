import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../lib/cache.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';

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
            clear: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
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

  it('should cache data', async () => {
    const key = 'testKey';
    const data = 'testData';
    const ttl = 60;

    await service.onlyCache(key, data, ttl);
    expect(cacheManager.set).toHaveBeenCalledWith(key, data, ttl * 1000);
  });

  it('should retrieve cached data', async () => {
    const key = 'testKey';
    const data = 'testData';
    (cacheManager.get as jest.Mock).mockResolvedValue(data);

    const result = await service.get<string>(key);
    expect(result).toBe(data);
    expect(cacheManager.get).toHaveBeenCalledWith(key);
  });

  it('should invalidate cache', async () => {
    const key = 'testKey';

    await service.invalidate(key);
    expect(cacheManager.del).toHaveBeenCalledWith(key);
  });

  it('should clear all cache', async () => {
    await service.invalidateAll();
    expect(cacheManager.clear).toHaveBeenCalled();
  });
});
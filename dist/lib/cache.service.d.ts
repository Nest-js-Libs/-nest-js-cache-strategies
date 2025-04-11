import { Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
export declare class CacheService {
    private cacheManager;
    private readonly logger;
    constructor(cacheManager: Cache, logger: Logger);
    cacheFirst<T>(key: string, fallback: () => Promise<T>, ttl: number): Promise<T>;
    onlyCache<T>(key: string, data: T, ttl: number): Promise<T>;
    invalidate(key: string): Promise<void>;
    invalidateAll(): Promise<void>;
    get<T>(key: string): Promise<T | undefined>;
}

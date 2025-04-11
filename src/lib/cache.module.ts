import { Global, Logger, LogLevel, Module, Provider } from '@nestjs/common';
import {
  CacheInterceptor,
  CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { CacheableMemory } from 'cacheable';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheService } from './cache.service';

const loggerProvider: Provider = {
  provide: Logger,
  useFactory: (configService: ConfigService) => {
    const level = configService.getOrThrow<LogLevel>('LOGGER_LEVEL', 'log');
    const logger = new Logger();
    logger.localInstance.setLogLevels?.([level]);
    return logger;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      provideInjectionTokensFrom: [loggerProvider],
      useFactory: async (configService: ConfigService, logger: Logger) => {
        const ttl = parseInt(
          configService.getOrThrow<string>('CACHE_TTL', '60'),
        );
        const max = parseInt(
          configService.getOrThrow<string>('CACHE_MAX_ITEMS', '999999'),
        );

        try {
          const store = await redisStore({
            url: `redis://${configService.getOrThrow<string>('REDIS_HOST')}:${configService.getOrThrow<string>('REDIS_PORT')}`,
            ttl: ttl * 1000,
          });
          logger.log('Successfully connected to Redis cache');
          return { store, ttl, max };
        } catch (error: unknown) {
          logger.warn(
            'Failed to connect to Redis, falling back to memory cache: ' +
              (error as Error).message,
          );
          return {
            store: new CacheableMemory({ ttl: ttl * 1000, lruSize: max }),
            ttl,
            max,
          };
        }
      },
      isGlobal: true,
      inject: [ConfigService, Logger],
    }),
  ],
  controllers: [],
  providers: [
    CacheService,
    loggerProvider,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("./cache.service");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
const cacheable_1 = require("cacheable");
const core_1 = require("@nestjs/core");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                useFactory: async (configService, logger) => {
                    const ttl = parseInt(configService.getOrThrow('CACHE_TTL', '60'));
                    const max = parseInt(configService.getOrThrow('CACHE_MAX_ITEMS', '999999'));
                    try {
                        const store = await (0, cache_manager_redis_store_1.redisStore)({
                            url: `redis://${configService.getOrThrow('REDIS_HOST')}:${configService.getOrThrow('REDIS_PORT')}`,
                            ttl: ttl * 1000,
                        });
                        logger.log('Successfully connected to Redis cache');
                        return { store, ttl, max };
                    }
                    catch (error) {
                        logger.warn('Failed to connect to Redis, falling back to memory cache: ' +
                            error.message);
                        return {
                            store: new cacheable_1.CacheableMemory({ ttl: ttl * 1000, lruSize: max }),
                            ttl,
                            max,
                        };
                    }
                },
                isGlobal: true,
                inject: [config_1.ConfigService, common_1.Logger],
            }),
        ],
        controllers: [],
        providers: [
            cache_service_1.CacheService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: cache_manager_1.CacheInterceptor,
            },
        ],
        exports: [cache_service_1.CacheService],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let CacheService = class CacheService {
    constructor(cacheManager, logger) {
        this.cacheManager = cacheManager;
        this.logger = logger;
    }
    async cacheFirst(key, fallback, ttl) {
        const cached = await this.cacheManager.get(key);
        if (cached) {
            fallback()
                .catch(err => {
                this.logger.error(err);
            })
                .then(fallbackResult => {
                this.cacheManager.set(key, fallbackResult, ttl * 1000);
            });
            return cached;
        }
        const data = await fallback();
        await this.cacheManager.set(key, data, ttl * 10000);
        return data;
    }
    async onlyCache(key, data, ttl) {
        return await this.cacheManager.set(key, data, ttl * 1000);
    }
    async invalidate(key) {
        await this.cacheManager.del(key);
    }
    async invalidateAll() {
        await this.cacheManager.clear();
    }
    async get(key) {
        return (await this.cacheManager.get(key));
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, common_1.Logger])
], CacheService);
//# sourceMappingURL=cache.service.js.map
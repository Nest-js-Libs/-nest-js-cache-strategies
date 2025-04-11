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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleService = exports.ResponseDto = void 0;
const common_1 = require("@nestjs/common");
const cache_service_1 = require("../lib/cache.service");
class ResponseDto {
}
exports.ResponseDto = ResponseDto;
let ExampleService = class ExampleService {
    constructor(cacheService) {
        this.cacheService = cacheService;
    }
    async test() {
        const result = {
            id: Math.floor(Math.random() * 1000),
            name: 'Cache test',
            status: 'ok',
        };
        const value = await this.cacheService.cacheFirst('test', async () => {
            const delay = new Promise(resolve => setTimeout(resolve, 5000));
            await delay.then(() => {
                console.log('Delayed for 1 second.');
            });
            return result;
        }, 36000);
        return value;
    }
    async getData(id) {
        return this.cacheService.cacheFirst(`data-${id}`, async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { id, data: `Datos para ${id}`, timestamp: new Date().toISOString() };
        }, 60);
    }
    async setData(id, data) {
        return this.cacheService.onlyCache(`data-${id}`, data, 60);
    }
    async invalidateData(id) {
        await this.cacheService.invalidate(`data-${id}`);
    }
    async invalidateAll() {
        await this.cacheService.invalidateAll();
    }
};
exports.ExampleService = ExampleService;
exports.ExampleService = ExampleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cache_service_1.CacheService])
], ExampleService);
//# sourceMappingURL=example.service.js.map
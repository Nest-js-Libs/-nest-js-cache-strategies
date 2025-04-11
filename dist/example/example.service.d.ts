import { CacheService } from '../lib/cache.service';
export declare class ResponseDto {
    id: number;
    name: string;
    status: string;
}
export declare class ExampleService {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    test(): Promise<ResponseDto>;
    getData(id: string): Promise<{
        id: string;
        data: string;
        timestamp: string;
    }>;
    setData(id: string, data: any): Promise<any>;
    invalidateData(id: string): Promise<void>;
    invalidateAll(): Promise<void>;
}

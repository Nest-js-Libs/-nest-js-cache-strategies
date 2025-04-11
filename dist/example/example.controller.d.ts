import { ExampleService, ResponseDto } from './example.service';
export declare class ExampleController {
    private readonly exampleService;
    constructor(exampleService: ExampleService);
    test(): Promise<ResponseDto>;
    getData(id: string): Promise<{
        id: string;
        data: string;
        timestamp: string;
    }>;
    setData(id: string, data: any): Promise<any>;
    invalidateData(id: string): Promise<{
        message: string;
    }>;
    invalidateAll(): Promise<{
        message: string;
    }>;
}

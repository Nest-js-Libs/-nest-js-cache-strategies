import { Injectable } from '@nestjs/common';
import { CacheService } from '../lib/cache.service';

export class ResponseDto {
    id: number;
    name: string;
    status: string;
}

@Injectable()
export class ExampleService {
  constructor(private readonly cacheService: CacheService) {}

  async test() {
    const result: ResponseDto = {
        id: Math.floor(Math.random() * 1000),
        name: 'Cache test',
        status: 'ok',
      };
  
      const value = await this.cacheService.cacheFirst<ResponseDto>(
        'test',
        async () => {
          // simular carga
          const delay = new Promise(resolve => setTimeout(resolve, 5000));
          await delay.then(() => {
            console.log('Delayed for 1 second.');
          });
  
          return result;
        },
        36000,
      ); // 10 hours
  
      return value;
  }

  async getData(id: string) {
    return this.cacheService.cacheFirst(
      `data-${id}`,
      async () => {
        // Simulamos una llamada a una API o base de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { id, data: `Datos para ${id}`, timestamp: new Date().toISOString() };
      },
      60, // TTL de 60 segundos
    );
  }

  async setData(id: string, data: any) {
    return this.cacheService.onlyCache(`data-${id}`, data, 60);
  }

  async invalidateData(id: string) {
    await this.cacheService.invalidate(`data-${id}`);
  }

  async invalidateAll() {
    await this.cacheService.invalidateAll();
  }
}
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ExampleService, ResponseDto } from './example.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Cache Test')
@Controller('/cache')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: 'Get cache test' })
  public async test(): Promise<ResponseDto> {
   return this.exampleService.test();
  }

  @Get(':id')
  async getData(@Param('id') id: string) {
    return this.exampleService.getData(id);
  }

  @Post(':id')
  async setData(@Param('id') id: string, @Body() data: any) {
    return this.exampleService.setData(id, data);
  }

  @Delete(':id')
  async invalidateData(@Param('id') id: string) {
    await this.exampleService.invalidateData(id);
    return { message: 'Cache invalidated' };
  }

  @Delete()
  async invalidateAll() {
    await this.exampleService.invalidateAll();
    return { message: 'All cache invalidated' };
  }
}
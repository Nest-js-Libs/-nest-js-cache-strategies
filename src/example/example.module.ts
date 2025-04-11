import { Module } from '@nestjs/common';
import { CacheModule } from '../lib/cache.module';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
  imports: [CacheModule],
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
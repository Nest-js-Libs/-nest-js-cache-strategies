import { NestFactory } from '@nestjs/core';
import { ExampleModule } from './example/example.module';

async function bootstrap() {
    const app = await NestFactory.create(ExampleModule);
    await app.listen(3000);
    console.log('Application is running on: http://localhost:3000');
  }
  bootstrap();
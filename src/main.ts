import { NestFactory } from '@nestjs/core';
import { ExampleModule } from './example/example.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = app => {
  const options = new DocumentBuilder()
    .setTitle('CACHE STRATEGIES')
    .setDescription('The CACHE STRATEGIES API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
};


async function bootstrap() {
  const app = await NestFactory.create(ExampleModule);
  swaggerConfig(app);
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
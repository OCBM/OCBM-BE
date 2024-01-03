import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {env} from 'process';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = env.PORT || 4000;
  const options = new DocumentBuilder()
    .setTitle('Omnex API')
    .setDescription('API for Omnex')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: false }, //do not set it to true it will convert array of object into multidimentional array it will cause issue in prisma
    }),
  );
  await app.listen(port,"0.0.0.0");
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

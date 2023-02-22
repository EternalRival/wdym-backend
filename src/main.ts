import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.use(
    ['/api', '/socketio'],
    basicAuth({
      challenge: true,
      users: {
        [configService.get('SWAGGER_USER', 'wdym')]: configService.get('SWAGGER_PASSWORD', ''),
      },
    }),
  );
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder().setTitle('WDYM-API').setVersion('1.0.2').build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api', app, swaggerDocument);

  await app.listen(configService.get('SERVER_PORT', 3000));
}
bootstrap();

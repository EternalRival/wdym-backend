import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  const swagger = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('WDYM-API').setVersion('1.0.1').build(),
    {},
  );
  SwaggerModule.setup('api', app, swagger);

  app.use(cookieParser())

  await app.listen(configService.get('SERVER_PORT', 3000));
}
bootstrap();

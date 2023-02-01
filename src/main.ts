import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // await app.listen(process.env.PORT || 3000);
  const port = app.get(ConfigService).get('PGPORT');
  console.log(app.get(ConfigService));
  await app.listen(port);
}
bootstrap();

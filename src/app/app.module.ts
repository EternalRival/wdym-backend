import { resolve } from 'path';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { AppMiddleware } from './app.middleware';
import { FileModule } from '../file/file.module';
import { LobbiesModule } from '../lobbies/lobbies.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        database: configService.get('DB_DATABASE'),
        entities: [User],
        synchronize: true,
        ssl: true,
      }),
    }),
    ServeStaticModule.forRoot({ rootPath: resolve('dist', 'docs'), serveRoot: '/docs' }),
    ServeStaticModule.forRoot({
      rootPath: resolve('node_modules', '@socket.io', 'admin-ui', 'ui', 'dist'),
      serveRoot: '/socketio',
    }),
    ServeStaticModule.forRoot({ rootPath: resolve('src', 'public') }),
    UsersModule,
    AuthModule,
    FileModule,
    ChatModule,
    /*  LobbiesModule */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    const excluded = ['js', 'docs', 'socketio'].map((route) => `/${route}/(.*)`);
    consumer
      .apply(AppMiddleware)
      .exclude(...excluded)
      .forRoutes('*');
  }
}

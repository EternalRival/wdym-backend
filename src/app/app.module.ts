import { resolve } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { IoModule } from '../io/io.module';
import { RoomsModule } from '../rooms/rooms.module';
import { ChatModule } from '../chat/chat.module';
import { LobbiesModule } from '../game/lobbies/lobbies.module';
import { GameModule } from '../game/game.module';

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
    ServeStaticModule.forRoot({ rootPath: resolve('src', 'public'), serveRoot: '/public' }),
    ServeStaticModule.forRoot({
      rootPath: resolve('node_modules', '@socket.io', 'admin-ui', 'ui', 'dist'),
      serveRoot: '/socketio',
    }),
    ServeStaticModule.forRoot({ rootPath: resolve('dist', 'docs') }),
    IoModule,
    UsersModule,
    AuthModule,
    FileModule,
    RoomsModule,
    ChatModule,
    LobbiesModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    // const excluded = ['public', 'socketio', 'images', 'js', 'styles'].map((route) => `/${route}/(.*)`);
    const excluded = ['js', 'ico', 'png', 'svg', 'woff2', 'css', 'webp', 'gif', 'html'].map((ext) => `/(.*).${ext}`);
    consumer
      .apply(AppMiddleware)
      .exclude(...excluded)
      .forRoutes('*');
  }
}

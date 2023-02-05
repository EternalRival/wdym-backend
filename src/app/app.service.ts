import { Injectable } from '@nestjs/common';

// TODO выбить
const date = new Date();

@Injectable()
export class AppService {
  public getHello(): string {
    // eslint-disable-next-line max-len
    return `WDYM-Server!<br><br><a href="/api">[API]</a><br><br>Last Build: ${date.toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
    })}`;
  }
}

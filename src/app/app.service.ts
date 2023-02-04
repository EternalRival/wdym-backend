import { Injectable } from '@nestjs/common';

// TODO выбить
const date = new Date();

@Injectable()
export class AppService {
  public getHello(): string {
    return `WDYM-Server!<br><br><a href="/api">[API]</a><br><br>Last Build: ${date.toLocaleString()}`;
  }
}

import { Injectable } from '@nestjs/common';

// TODO выбить
const date = new Date();

@Injectable()
export class AppService {
  public getHello(): string {
    return `Hello World!<br><br><a href="/api">[API]</a><br><br>${date.toLocaleString()}`;
  }
}

import { Injectable } from '@nestjs/common';

// TODO выбить
const date = new Date();

@Injectable()
export class AppService {
  public getHello(): string {
    return `WDYM-Server!

<a href="/api">[API]</a>

Last Build: ${date.toLocaleString()}

Last Build: ${date.toISOString()}

Last Build: ${date.toString()}

Last Build: ${date.toUTCString()}

Last Build: ${date.getTimezoneOffset()}`;
  }
}

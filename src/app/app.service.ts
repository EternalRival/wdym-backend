import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getUptime(): number {
    return process.uptime();
  }
}

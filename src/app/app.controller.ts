import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Misc')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('uptime')
  public getUptime(): number {
    return this.appService.getUptime();
  }
}

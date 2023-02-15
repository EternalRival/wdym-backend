import { Controller, Get, Param, Query, Req, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Folder } from './enums/folder.enum';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // TODO под снос
  @Get(`${Folder.Avatars}/:fileName`)
  private getAvatar(@Req() req: Request, @Param('fileName') fileName: string): string {
    const origin = `${req.protocol}://${req.headers.host}`;
    const path = this.fileService.getFile(Folder.Avatars, fileName);
    return origin + path;
  }
  @Get(Folder.Avatars)
  private async getAvatarList(): Promise<string[]> {
    return this.fileService.getFileNames(Folder.Avatars);
  }
  @Get('random-avatar')
  private async getRandomAvatar(@Req() req: Request): Promise<string> {
    const origin = `${req.protocol}://${req.headers.host}`;
    const path = await this.fileService.getRandomAvatar();
    return origin + path;
  }

  // TODO под снос
  @Get(`${Folder.Meme}/:fileName`)
  private getMeme(@Req() req: Request, @Param('fileName') fileName: string): string {
    const origin = `${req.protocol}://${req.headers.host}`;
    const path = this.fileService.getFile(Folder.Meme, fileName);
    return origin + path;
  }
  @Get(Folder.Meme)
  private async getMemeList(): Promise<string[]> {
    return this.fileService.getFileNames(Folder.Meme);
  }
}

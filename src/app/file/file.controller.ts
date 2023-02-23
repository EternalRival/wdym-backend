import { Body, Controller, Get, Header, Post, Query, Req, StreamableFile } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Folder } from './enums/folder.enum';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(Folder.Avatars)
  private async getAvatarList(@Req() req: Request): Promise<string[]> {
    const origin = `${req.protocol}://${req.headers.host}`;
    return this.fileService.getFileUrls(origin, Folder.Avatars);
  }
  @Get('random-avatar')
  private async getRandomAvatar(@Req() req: Request): Promise<string> {
    const origin = `${req.protocol}://${req.headers.host}`;
    return this.fileService.getRandomAvatar(origin);
  }

  @Get(Folder.Meme)
  @ApiQuery({ name: 'quantity', required: false })
  @ApiQuery({ name: 'shuffle', required: false })
  private async getMemeList(
    @Req() req: Request,
    @Query('quantity') quantity?: number,
    @Query('shuffle') shuffle?: boolean,
  ): Promise<string[]> {
    const origin = `${req.protocol}://${req.headers.host}`;
    return this.fileService.getFileUrls(origin, Folder.Meme, quantity, shuffle);
  }

  @Post(`${Folder.Meme}/zip`)
  @Header('Content-Type', 'application/zip')
  @Header('Content-Disposition', 'attachment; filename="memes.zip"')
  @ApiBody({ required: false, isArray: true })
  private getMemeArchive(@Body() urlList: string[]): Promise<StreamableFile> {
    return this.fileService.getMemeArchive(urlList);
  }
}

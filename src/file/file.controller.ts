import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Folder } from './enums/folder.enum';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(`${Folder.Avatars}/:id`)
  public getAvatar(@Param('id') id: string): StreamableFile {
    return this.fileService.getFile(Folder.Avatars, id);
  }

  @Get(`${Folder.Meme}/:id`)
  public getMeme(@Param('id') id: string): StreamableFile {
    return this.fileService.getFile(Folder.Meme, id);
  }
}

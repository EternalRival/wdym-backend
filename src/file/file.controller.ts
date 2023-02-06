import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Folder } from './enums/folder.enum';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(`${Folder.Avatars}/:id`)
  public getAvatar(@Param('id') id: string): StreamableFile {
    return this.fileService.getFile(Folder.Avatars, id);
  }
  @Get(`${Folder.Avatars}`)
  public async getAvatarList(): Promise<number[]> {
    return this.fileService.getFileList(Folder.Avatars);
  }

  @Get(`${Folder.Meme}/:id`)
  public getMeme(@Param('id') id: string): StreamableFile {
    return this.fileService.getFile(Folder.Meme, id);
  }
}

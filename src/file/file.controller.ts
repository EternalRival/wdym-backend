import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Folder } from './enums/folder.enum';
import { FileService } from './file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(`${Folder.Avatars}/:fileName`)
  private getAvatar(@Param('fileName') fileName: string): Promise<StreamableFile> {
    return this.fileService.getFile(Folder.Avatars, fileName);
  }
  @Get(`${Folder.Avatars}`)
  private async getAvatarList(): Promise<string[]> {
    return this.fileService.getFileNames(Folder.Avatars);
  }

  @Get(`${Folder.Meme}/:fileName`)
  private getMeme(@Param('fileName') fileName: string): Promise<StreamableFile> {
    return this.fileService.getFile(Folder.Meme, fileName);
  }
  @Get(`${Folder.Meme}`)
  private async getMemeList(): Promise<string[]> {
    return this.fileService.getFileNames(Folder.Meme);
  }
}

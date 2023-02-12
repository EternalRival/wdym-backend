import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream, ReadStream } from 'fs';
import { readdir } from 'fs/promises';
import { lookup } from 'mime-types';
import { parse, resolve, ParsedPath } from 'path';
import { getRandomArrayItem } from '../utils/randomize';
import { Extension } from './enums/extension.enum';
import { Folder } from './enums/folder.enum';

@Injectable()
export class FileService {
  private ASSETS_ROOT: string = resolve('src', 'public', 'assets');
  private ALLOWED_EXTENSIONS: string[] = Object.values(Extension);

  public async getFile(dir: Folder, name: string): Promise<StreamableFile> {
    const dirPath: string = resolve(this.ASSETS_ROOT, dir);
    const path: string = await this.getFilePath(dirPath, name);
    const stream: ReadStream = createReadStream(path);

    return new StreamableFile(stream, { type: lookup(path) || 'text/plain' });
  }

  public async getFileNames(dir: Folder): Promise<string[]> {
    const path: string = resolve(this.ASSETS_ROOT, dir);
    const files: ParsedPath[] = await this.getFiles(path);

    return files.reduce((fileNames, { name, ext }) => {
      if (this.ALLOWED_EXTENSIONS.includes(ext)) {
        fileNames.push(name);
      }
      return fileNames;
    }, []);
  }

  private async getFilePath(dir: string, fileName: string): Promise<string> {
    const inputFile: ParsedPath = parse(fileName);
    const staticFiles: ParsedPath[] = await this.getFiles(dir);

    const file: ParsedPath = staticFiles.find((staticFile) => staticFile.name === inputFile.name);
    return resolve(dir, file.base);
  }

  private async getFiles(dir: string): Promise<ParsedPath[]> {
    return Array.from(await readdir(dir), parse);
  }

  //? TL Req
  public async getRandomAvatar(): Promise<StreamableFile> {
    const path: string = resolve(this.ASSETS_ROOT, Folder.Avatars);
    const files: ParsedPath[] = await this.getFiles(path);
    const randomFile = getRandomArrayItem(files);
    return this.getFile(Folder.Avatars, randomFile.name);
  }
}

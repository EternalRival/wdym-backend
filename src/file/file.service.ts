import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { readdir } from 'fs/promises';
import { parse, resolve } from 'path';
import { Folder } from './enums/folder.enum';

@Injectable()
export class FileService {
  private assetsRoot = resolve('src', 'public', 'assets');
  public getFile(folder: Folder, id: string): StreamableFile {
    const path = resolve(this.assetsRoot, 'images', folder, `${id}.webp`);
    const file = createReadStream(path);
    return new StreamableFile(file, { type: 'image/webp' });
  }
  public async getFileList(folder: Folder): Promise<number[]> {
    return Array.from(await readdir(resolve(this.assetsRoot, 'images', folder)), (file) => +parse(file).name);
  }
}

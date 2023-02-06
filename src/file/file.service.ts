import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { readdir } from 'fs/promises';
import { join, parse } from 'path';
import { Folder } from './enums/folder.enum';

@Injectable()
export class FileService {
  private assetsRoot = join(__dirname, '..', 'assets');
  public getFile(folder: Folder, id: string): StreamableFile {
    const path = join(this.assetsRoot, folder, `${id}.webp`);
    const file = createReadStream(path);
    return new StreamableFile(file, { type: 'image/webp' });
  }
  public async getFileList(folder: Folder): Promise<number[]> {
    return Array.from(await readdir(join(this.assetsRoot, folder)), (file) => +parse(file).name);
  }
}

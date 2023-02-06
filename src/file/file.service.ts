import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Folder } from './enums/folder.enum';

@Injectable()
export class FileService {
  public getFile(folder: Folder, id: string): StreamableFile {
    const path = join(__dirname, '..', 'assets', folder, `${id}.webp`);
    const file = createReadStream(path);
    return new StreamableFile(file, { type: 'image/webp' });
  }
}

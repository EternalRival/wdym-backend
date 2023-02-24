import { Injectable, StreamableFile } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { readdir } from 'fs/promises';
import { basename, resolve, join } from 'path';
import { teapot } from '../../utils/custom-error';
import { getRandomArrayItem, shuffleArray } from '../../utils/randomize';
import { Folder } from './enums/folder.enum';

enum Root {
  src = 'src',
  web = '/',
}
@Injectable()
export class FileService {
  private ASSETS_DIR: string = join('public', 'assets');
  private url(root: Root, ...paths: string[]): string {
    return resolve(root, this.ASSETS_DIR, ...paths);
  }

  public async getFileUrls(origin: string, path: Folder, quantity?: number, shuffle?: boolean): Promise<string[]> {
    if (typeof quantity !== 'undefined') {
      if (!Number.isInteger(+quantity)) {
        throw teapot('Quantity is not an Integer');
      }
      if (quantity < 1) {
        throw teapot('Quantity is negative');
      }
    }
    const dir: string = this.url(Root.src, path);
    let fileNames: string[] = await readdir(dir);
    if (shuffle) {
      fileNames = shuffleArray(fileNames);
    }
    if (quantity) {
      fileNames = fileNames.slice(0, quantity);
    }
    return fileNames.map((fileName) => `${origin}${this.url(Root.web, path, fileName)}`);
  }

  public async getRandomAvatar(origin: string): Promise<string> {
    const dir: string = this.url(Root.src, Folder.Avatars);
    const fileNames: string[] = await readdir(dir);
    const randomFileName: string = getRandomArrayItem(fileNames);
    return `${origin}${this.url(Root.web, Folder.Avatars, randomFileName)}`;
  }

  public async getMemeArchive(urlList?: string[]): Promise<StreamableFile> {
    const dir: string = this.url(Root.src, Folder.Meme);
    const fileNames: string[] = await readdir(dir);
    const missedFiles: string[] = [];

    const zip = new AdmZip();

    if (urlList && urlList.length > 0) {
      urlList.forEach((url) => {
        const name: string = basename(url);
        if (fileNames.includes(name)) {
          zip.addLocalFile(join(dir, name));
        } else {
          missedFiles.push(name);
        }
      });
    } else {
      zip.addLocalFolder(dir);
    }

    if (missedFiles.length > 0) {
      zip.addFile('README.md', Buffer.from(`Missed Files:\n\n${missedFiles.join('\n')}`, 'utf8'));
    }

    return new StreamableFile(zip.toBuffer());
  }
}

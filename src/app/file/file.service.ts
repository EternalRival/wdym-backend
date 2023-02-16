import { Injectable } from '@nestjs/common';
import { readdir } from 'fs/promises';
import { resolve, join } from 'path';
import { Server, Socket } from 'socket.io';
import { getRandomArrayItem, shuffle } from '../../utils/randomize';
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

  public async getFileNames(origin: string, path: Folder): Promise<string[]> {
    const dir: string = this.url(Root.src, path);
    const fileNames: string[] = await readdir(dir);
    return fileNames.map((fileName) => `${origin}${this.url(Root.web, path, fileName)}`);
  }

  public async getRandomAvatar(origin: string): Promise<string> {
    const dir: string = this.url(Root.src, Folder.Avatars);
    const fileNames: string[] = await readdir(dir);
    const randomFileName: string = getRandomArrayItem(fileNames);
    return `${origin}${this.url(Root.web, Folder.Avatars, randomFileName)}`;
  }

  public async getRandomMemes(io: Server, socket: Socket, quantity: number): Promise<string[]> {
    const dir: string = this.url(Root.src, Folder.Meme);
    const fileNames: string[] = await readdir(dir);
    const randomFileNames: string[] = shuffle(fileNames).slice(0, quantity);
    const { host } = socket.request.headers;
    return randomFileNames.map((fileName) => `${host}${this.url(Root.web, Folder.Meme, fileName)}`);
  }
}

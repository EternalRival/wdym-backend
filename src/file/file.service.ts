import { Injectable } from '@nestjs/common';
import { readdir } from 'fs/promises';
import { resolve, join } from 'path';
import { Server, Socket } from 'socket.io';
import { getRandomArrayItem, shuffle } from '../utils/randomize';
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

  public getFile(path: Folder, name: string): string {
    return this.url(Root.web, path, name);
  }

  public getFileNames(path: Folder): Promise<string[]> {
    const dir: string = this.url(Root.src, path);
    return readdir(dir);
  }

  public async getRandomAvatar(): Promise<string> {
    const dir: string = this.url(Root.src, Folder.Avatars);
    const fileNames: string[] = await readdir(dir);
    const randomFileName: string = getRandomArrayItem(fileNames);
    return this.url(Root.web, Folder.Avatars, randomFileName);
  }

  public async getRandomMemes(io: Server, socket: Socket, quantity: number): Promise<string[]> {
    const dir: string = this.url(Root.src, Folder.Meme);
    const fileNames: string[] = await readdir(dir);
    const randomFileNames: string[] = shuffle(fileNames).slice(0, quantity);
    const { host } = socket.request.headers;
    return randomFileNames.map((fileName) => host + this.url(Root.web, Folder.Meme, fileName));
  }
}

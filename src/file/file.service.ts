import { Injectable, StreamableFile } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { createReadStream, ReadStream } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { lookup } from 'mime-types';
import { parse, resolve, ParsedPath, join } from 'path';
import { Server, Socket } from 'socket.io';
import { getRandomArrayItem, shuffle } from '../utils/randomize';
import { Extension } from './enums/extension.enum';
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
    const dir = this.url(Root.src, path);
    return readdir(dir);
  }

  public async getRandomAvatar(): Promise<string> {
    const dir = this.url(Root.src, Folder.Avatars);
    const fileNames = await readdir(dir);
    const randomFileName = getRandomArrayItem(fileNames);
    return this.url(Root.web, Folder.Avatars, randomFileName);
  }

  public async getRandomMemes(io: Server, client: Socket, quantity: number): Promise<string[]> {
    const dir = this.url(Root.src, Folder.Meme);
    const fileNames = await readdir(dir);
    const randomFileNames = shuffle(fileNames).slice(0, quantity);
    const { host } = client.request.headers;
    return randomFileNames.map((fileName) => host + this.url(Root.web, Folder.Meme, fileName));
  }
}

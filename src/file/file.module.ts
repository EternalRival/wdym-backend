import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileGateway } from './file.gateway';

@Module({
  controllers: [FileController],
  providers: [FileGateway, FileService],
})
export class FileModule {}

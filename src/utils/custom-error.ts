import { HttpException, HttpStatus } from '@nestjs/common';

export function teapot(message: string): HttpException {
  return new HttpException(message, HttpStatus.I_AM_A_TEAPOT);
}

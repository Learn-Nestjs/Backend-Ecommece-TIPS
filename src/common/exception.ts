// defined common exception in here

import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor() {
    super('Recource Not Found', HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends HttpException {
  constructor(message: 'Conflict'){
    super(message, HttpStatus.CONFLICT)
  }
}

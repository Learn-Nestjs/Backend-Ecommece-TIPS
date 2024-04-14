// defined common exception in here

import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor() {
    super('Recource Not Found', HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict'){
    super(message, HttpStatus.CONFLICT)
  }
}


export class ServerError extends HttpException {
  constructor(message = "Something went wrong") {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

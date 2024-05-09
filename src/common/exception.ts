// defined common exception in here

import { HttpException, HttpStatus, ForbiddenException} from '@nestjs/common';

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

export class Forbidden extends HttpException {
  constructor(message = "Forbidden") {
    super(message, HttpStatus.FORBIDDEN)
  }
}

export class ServerError extends HttpException {
  constructor(message = "Something went wrong") {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export class CustomeError extends HttpException {
  constructor(message = "error", code : number ) {
    super(message, code)
  }
}

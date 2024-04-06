import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  log(message: any, context?: string) {
    super.log(message, context);
  }

  error(message: any, context?: string) {
    super.log(message, context);
  }
}

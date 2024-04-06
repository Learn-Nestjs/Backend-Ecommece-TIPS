import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // config

  // logger
  app.useLogger(app.get(LoggerService));

  //

  // auto validate
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true, // not console.log()
      whitelist: true, // just get all property defined in dto class, other property is remove
      transform: true, // convert object form req to exaclly data defined in dto
    }),
  );

  // cath all exception http error

  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3055);
}
bootstrap();

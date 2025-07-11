import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { NotFoundExceptionFilter } from './common/filters/not-found-exceptopm.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new BadRequestExceptionFilter(), new NotFoundExceptionFilter());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: any): Response<T> & { status: number; message: string } => {
        const ctx = context.switchToHttp();
        const getResponse = ctx.getResponse<{ statusCode: number }>();
        const status: number = getResponse.statusCode;

        if (data && typeof data === 'object' && 'meta' in data) {
          const meta = (data as { meta: object }).meta;
          const responseData = (data as { data: T }).data;
          return {
            status,
            message: 'SUCCESS',
            data: responseData,
            ...meta,
          };
        }

        return { status, message: 'SUCCESS', data: data as T };
      }),
    );
  }
}

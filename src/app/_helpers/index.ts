import { HTTP_INTERCEPTORS } from '@angular/common/http';

export * from './auth.guard';
export * from './error.interceptor';
export * from './jwt.interceptor';
export * from './fake-backend';

/* "Barrel" of Http Interceptors */
import { ErrorInterceptor } from './error.interceptor';
import { JwtInterceptor } from './jwt.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];
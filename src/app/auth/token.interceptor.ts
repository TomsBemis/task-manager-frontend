import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

import { Provider } from '@angular/core';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private authService: AuthService) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Get session token and append it to the header
    const accessToken = this.cookieService.get("accessToken");
    let newRequest;
    if (accessToken) {
      newRequest = this.appendAccessToken(request, accessToken);
      if (newRequest) {
        return next.handle(newRequest).pipe(
          catchError((error) => {
            // Check if the error is due to an expired access token
            if (error.status === 401 && accessToken) {
              return this.handleExpiredAccessToken(request, next);
            }
    
            return throwError(error);
          })
        );
      }
    }
    
    return next.handle(request);
    
    // return next.handle(request).pipe(
    //   catchError((error) => {
    //     // Check if the error is due to an expired access token
    //     if (error.status === 401 && accessToken) {
    //       return this.handleExpiredAccessToken(request, next);
    //     }

    //     return throwError(error);
    //   })
    // );
    
  }

  private appendAccessToken(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    let authenticationCredentials : AuthCredentials = {
      accessToken: this.cookieService.get('accessToken'),
      refreshToken: this.cookieService.get('refreshToken'),
      userId: this.cookieService.get('userId') 
    }
    return request = request.clone({
      setHeaders: {
        authorization: JSON.stringify(authenticationCredentials)
      }
    });
  }

  private handleExpiredAccessToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Call the refresh token endpoint to get a new access token
    return this.authService.getNewAccessToken().pipe(
      switchMap(() => {
        const newAccessToken = this.cookieService.get("accessToken");
        // Retry the original request with the new access token
        return next.handle(this.appendAccessToken(request, newAccessToken));
      }),
      catchError((error) => {
        // Handle refresh token error (e.g., redirect to login page)
        console.error('Error handling expired access token:', error);
        return throwError(error);
      })
    );
  }
}

// Injection token for the Http Interceptors multi-provider
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthCredentials } from './user.model';

/** Provider for the Noop Interceptor. */
export const tokenInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true };
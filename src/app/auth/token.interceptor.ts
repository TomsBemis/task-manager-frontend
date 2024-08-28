import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';

import { Provider } from '@angular/core';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private cookieService: CookieService, 
    private authService: AuthService, 
    private router: Router
  ) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Get session token and append it to the header
    let newRequest;
    try {
      newRequest = this.appendAccessToken(request);
      return next.handle(newRequest).pipe(
        catchError((error) => {
          // Check if the error is due to an expired access token
          if (error.status === 401) {
            return this.handleExpiredAccessToken(request, next);
          }
  
          return throwError(error);
        })
      );
    }
    catch (error) {
      // Redirect to login page because access token cookie is missing
      this.router.navigate(['/login']);
    }
    return next.handle(request);
   
  }

  private appendAccessToken(request: HttpRequest<any>): HttpRequest<any> {
    const fetchedAccessToken = this.cookieService.get("accessToken");

    if(!fetchedAccessToken) throw Error("Access token not found in cookies");
    
    return request = request.clone({
      setHeaders: {
        access_token: fetchedAccessToken
      }
    });
  }

  private handleExpiredAccessToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Call the refresh token endpoint to get a new access token
    return this.authService.getNewAccessToken().pipe(
      switchMap(() => {
        // Retry the original request with the new access token
        return next.handle(this.appendAccessToken(request));
      }),
      catchError((error) => {
        // Handle refresh token error (e.g., redirect to login page)
        console.error('Error handling expired access token:', error);
        return throwError(error);
      })
    );
  }
}

/** Provider for the token Interceptor. */
export const tokenInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true };
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private authService: AuthService) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Get session token and append it to the header
    const accessToken = this.cookieService.get("accessToken");
    if (accessToken) this.appendAccessToken(request, accessToken);
    
    return next.handle(request).pipe(
      catchError((error) => {
        // Check if the error is due to an expired access token
        if (error.status === 401 && accessToken) {
          return this.handleExpiredAccessToken(request, next);
        }

        return throwError(error);
      })
    );
    
  }

  private appendAccessToken(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return request = request.clone({
      setHeaders: {
        authorization: accessToken
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
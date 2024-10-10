import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { beApiRoutes } from "../routes/be-api.routes";
import { catchError, first, tap } from "rxjs/operators";
import { UserData } from "../users/user.model";
import { LoginCredentials, AuthCredentials, LoginResponse, RegisterCredentials } from "../routes/app.routes";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: 'root' })
export class AuthService {

    public currentUserSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
    public currentUser$: Observable<UserData | null> = this.currentUserSubject.asObservable();

    constructor (private cookieService: CookieService, private httpClient: HttpClient) {}

    public login(userCredentials : LoginCredentials): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(
            beApiRoutes.login, 
            userCredentials
        ).pipe(
            first(),
            tap((response) => {
                this.currentUserSubject.next(response.user);
                this.setAuthCookies(response.authentication);
            })
        );
    }

    public register(registerCredentials : RegisterCredentials): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(
            beApiRoutes.register, 
            registerCredentials
        ).pipe(
            first(),
            tap((response) => {
                this.currentUserSubject.next(response.user);
                this.setAuthCookies(response.authentication);

                return response;
            }),
            catchError((errorResponse: HttpErrorResponse) => {
                return throwError(() => new Error(errorResponse.error));
            }),
        );
    }

    public logout(): Observable<void> {
        return this.httpClient.get<void>(beApiRoutes.logout).pipe(
            first(),
            tap(() => {
                this.cookieService.delete('refreshToken');
                this.cookieService.delete('accessToken');
                this.cookieService.delete('userId');
                this.cookieService.delete('loggedIn');
                this.currentUserSubject.next(null);
                return;
            })
        );
    }

    public getNewAccessToken(): Observable<AuthCredentials> {
        const refreshToken = this.cookieService.get('refreshToken');
        if(!refreshToken) {
            throw Error("Missing refresh token");
        };
        return this.httpClient.post<AuthCredentials>(
            beApiRoutes.refreshToken, 
            refreshToken
        ).pipe(first(), tap(response => {
            this.cookieService.set('refreshToken', response.refreshToken);
            this.cookieService.set('accessToken', response.accessToken);
            return response;
        }));
    }

    private setAuthCookies(authenticationData: any) {
        this.cookieService.set('loggedIn',"true");
        this.cookieService.set('userId',authenticationData.userId);
        this.cookieService.set('refreshToken', authenticationData.refreshToken);
        this.cookieService.set('accessToken', authenticationData.accessToken);    
    }
}
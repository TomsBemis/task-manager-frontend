import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { beApiRoutes } from "../routes/be-api.routes";
import { first, tap } from "rxjs/operators";
import { LoginCredentials, AuthCredentials, User, LoginResponse } from "../users/user.model";
import { BehaviorSubject, Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: 'root' })
export class AuthService {

    public currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

    constructor (private cookieService: CookieService, private httpClient: HttpClient) {}

    public login(userCredentials : LoginCredentials): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(
            beApiRoutes.login, 
            userCredentials
        ).pipe(
            first(),
            tap((response) => {
                this.currentUserSubject.next(response.user);
                this.cookieService.set('loggedIn',"true");
                this.cookieService.set('userId',response.authentication.userId);
                this.cookieService.set('refreshToken', response.authentication.refreshToken);
                this.cookieService.set('accessToken', response.authentication.accessToken);
            })
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
}
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { beApiRoutes } from "../routes/be-api.routes";
import { first, tap } from "rxjs/operators";
import { LoginCredentials, AuthCredentials, User, LogoutCredentials, LoginResponse } from "../users/user.model";
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
        );
    }

    public logout(): Observable<HttpResponse<AuthCredentials>> {
        let logoutCredentials : LogoutCredentials = {
            username : this.currentUserSubject.getValue()?.username ?? "",
            password : this.currentUserSubject.getValue()?.password ?? "",
            refreshToken : this.cookieService.get('refreshToken')
        }
        return this.httpClient.post<AuthCredentials>(
            beApiRoutes.logout, 
            logoutCredentials,
            { observe: 'response' }
        ).pipe(first(), tap(response => {
            if (response.ok) {
                this.cookieService.delete('refreshToken');
                this.cookieService.delete('accessToken');
                this.cookieService.delete('userId');
                this.cookieService.delete('loggedIn');
                this.currentUserSubject.next(null);
            }
            return response
        }));
    }

    public getNewAccessToken(): Observable<HttpResponse<AuthCredentials>> {
        const refreshToken = this.cookieService.get('refreshToken');
        if(!refreshToken) {
            throw Error("Missing refresh token");
        };
        return this.httpClient.post<AuthCredentials>(
            beApiRoutes.refreshToken, 
            refreshToken,
            { observe: 'response' }
        ).pipe(first(), tap(response => {
            if (response.ok) {
                this.cookieService.set('refreshToken', response.body?.refreshToken ?? "");
                this.cookieService.set('accessToken', response.body?.accessToken ?? "");
            }
            return response;
        }));
    }
}
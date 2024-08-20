import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { beApiRoutes } from "../routes/be-api.routes";
import { first, tap } from "rxjs/operators";
import { LoginCredentials, AuthResponse, User } from "./user.model";
import { BehaviorSubject, Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: 'root' })
export class AuthService {

    public currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

    constructor (private cookieService: CookieService, private httpClient: HttpClient) {}

    public login(userCredentials : LoginCredentials): Observable<AuthResponse> {
        return this.httpClient.post<AuthResponse>(
            beApiRoutes.login, 
            userCredentials
        );
    }

    public getNewAccessToken(): Observable<HttpResponse<AuthResponse>> {
        const refreshToken = this.cookieService.get('refreshToken');
        if(!refreshToken) {
            throw Error("Missing refresh token");
        };
        return this.httpClient.post<AuthResponse>(
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
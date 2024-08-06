import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { beApiRoutes } from "../../routes/be-api.routes";
import { first, tap } from "rxjs/operators";
import { User } from "../user.model";
import { Observable } from "rxjs";

@Injectable()
export class AuthService {

    currentUser : User | null = null;
    constructor (private httpClient: HttpClient) {}

    public login(userCredentials : { username : string, password : string}) : Observable<HttpResponse<User>> {
        return this.httpClient.post<User>(
            beApiRoutes.login, 
            userCredentials,
            { observe: 'response' }
        ).pipe(first(), tap(response => {
            if (response.ok) this.currentUser = response.body;
            return response;
        }));
    }
}
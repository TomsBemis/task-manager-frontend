import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { User, UserRole } from "./user.model";
import { first, map, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { beApiRoutes } from "../routes/be-api.routes";

@Injectable({ providedIn: "root" })
export class UserService{
    
    public usersSubject = new BehaviorSubject<User[]>([]);
    public users$ = this.usersSubject.asObservable();

    constructor(private httpClient: HttpClient) {}

    public getUsers(): Observable<User[]> {
        return this.httpClient.get<{users: User[]}>(beApiRoutes.users).pipe(
            first(),
            tap(responseUsers => {
                this.usersSubject.next(responseUsers.users.sort(
                    (userA, userB) => {
                        // Compare first names, if they are the same then compare last names
                        const firstNameComparison = userA.firstName.localeCompare(userB.firstName);
                        return firstNameComparison !== 0 ? firstNameComparison : userA.lastName.localeCompare(userB.lastName);
                }));
            }),
            map(response => {return response.users;})
        );
    }

    public getUserById(userId: string): Observable<User> {
        return this.httpClient.get<{user: User}>(beApiRoutes.users + "/" + userId)
            .pipe(
                first(),
                map(response => {
                    return response.user;
                })
            );
    }

    public updateUserRoles(userId: string, newRoles: UserRole[]): Observable<User> {
        return this.httpClient.post<User>(
            beApiRoutes.users + "/" + userId,
            { roles: newRoles }
        ).pipe(
            first(),
            tap(responseUser => {
                return responseUser;
            })
        );
    }
}
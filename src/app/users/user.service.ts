import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { User } from "./user.model";
import { first, map, Observable, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { beApiRoutes } from "../routes/be-api.routes";
import { response } from "express";

@Injectable({ providedIn: "root" })
export class UserService{
    
    public usersSubject = new BehaviorSubject<User[]>([]);
    public usersObservable$ = this.usersSubject.asObservable();

    constructor(private httpClient: HttpClient) {}

    public getUsers(): Observable<User[]> {
        return this.httpClient.get<{users: User[]}>(beApiRoutes.users).pipe(
            first(),
            tap(responseUsers => {
                this.usersSubject.next(responseUsers.users.sort(
                    (userA, userB) => {
                        let userFullNameA = userA.firstName+' '+userA.lastName;
                        let userFullNameB = userB.firstName+' '+userB.lastName;
                        return (userFullNameA < userFullNameB) ? -1 : (userFullNameA > userFullNameB) ? 1 : 0
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
}
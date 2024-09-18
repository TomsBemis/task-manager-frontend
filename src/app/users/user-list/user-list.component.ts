import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AsyncPipe } from '@angular/common';
import { UserItemComponent } from "../user-item/user-item.component";
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    AsyncPipe,
    UserItemComponent
],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  userList = this.userService.usersSubject;
  userList$ = this.userService.usersSubject.asObservable();

  constructor(private userService: UserService, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {

    // Check if logged in user is admin, or if not then compare ids
    let loggedInUser = this.authService.currentUserSubject.getValue();
    if(!loggedInUser || loggedInUser.role.value != "ADMIN") throw Error("Only users with administrator priviledges have access.");

    // If user list is empty then try to initialize
    if(this.userList.getValue().length === 0) {
      this.userService.getUsers().subscribe(
        fetchedUsers => {this.userList.next(fetchedUsers);}
      )
    }
  }
}

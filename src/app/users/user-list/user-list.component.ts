import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AsyncPipe } from '@angular/common';
import { UserItemComponent } from "../user-item/user-item.component";

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // If user list is empty then try to initialize
    if(this.userList.getValue().length === 0) {
      this.userService.getUsers().subscribe(
        fetchedUsers => {this.userList.next(fetchedUsers);}
      )
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  user: User | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.getCurrentTask();
  }

  getCurrentTask() {
    // Get user id from route parameters then pass it as argument for user service
    // set the component task when async method is done
    this.route.params.pipe(
      map(params => params['id'] as string),
      switchMap(userId => {
        return this.userService.getUserById(userId)
      }),
      take(1)
    ).subscribe(responseUser => { this.user = responseUser; });

  }
}

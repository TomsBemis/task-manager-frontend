import { Component, Input } from '@angular/core';
import { User } from '../user.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss'
})
export class UserItemComponent {

  @Input() userItem: User = {} as User;

}

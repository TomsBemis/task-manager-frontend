import { Component } from '@angular/core';
import { TaskService } from './task.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavComponent } from '../shared/nav/nav.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    NavComponent
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
}

import { Component } from '@angular/core';
import { TaskService } from './task.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavComponent } from '../shared/nav/nav.component';
import { IdGeneratorService } from './id-generator-service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    NavComponent
  ],
  providers: [
    TaskService,
    IdGeneratorService
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
}

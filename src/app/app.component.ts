import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { Task } from './tasks/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CreateTaskComponent,
    TaskListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'task-manager';

  tasks: Task[] = [
    new Task('TM-2', 'Setup Angular CLI', new Date('2024-05-22'),'Open'),
    new Task('TM-3', 'Create new application', new Date('2024-05-22'),'Open'),
    new Task('TM-4', 'Task List Application - Create base', new Date('2024-05-22'),'Open'),
  ];

  onTaskCreated(taskData: Task) {
    this.tasks.push(taskData);
  }
}

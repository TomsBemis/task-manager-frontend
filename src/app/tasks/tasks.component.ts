import { Component, OnInit } from '@angular/core';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CreateTaskComponent,
    TaskListComponent
  ],
  providers: [
    TaskService
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  // Load task data and subscribe to events
  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.taskService.taskCreated.subscribe(
      (task: Task) => {
        this.taskService.addTask(task);
        this.tasks = this.taskService.getTasks(); // Reload task data after changes
      }
    );
    this.taskService.taskDeleted.subscribe(
      (taskTitle: string) => {
        this.taskService.deleteTask(taskTitle);
        this.tasks = this.taskService.getTasks(); // Reload task data after changes
      }
    );
  }
}

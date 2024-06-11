import { Component, OnInit } from '@angular/core';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { Task } from './task.model';
import { TaskService } from './task.service';
import { TaskList } from './task-list.model';

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

  taskList: TaskList | undefined;

  constructor(private taskService: TaskService) {}

  // Load task data and subscribe to events
  ngOnInit(): void {
    this.taskList = this.taskService.getTasks();
    this.taskService.taskCreated.subscribe(
      (task: Task) => {
        this.taskService.addTask(task);
        this.taskList = this.taskService.getTasks(); // Reload task data after changes
      }
    );
    this.taskService.taskDeleted.subscribe(
      (taskTitle: string) => {
        this.taskService.deleteTask(taskTitle);
        this.taskList = this.taskService.getTasks(); // Reload task data after changes
      }
    );
  }
}

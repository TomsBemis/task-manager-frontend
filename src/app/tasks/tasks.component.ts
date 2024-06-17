import { Component, OnInit } from '@angular/core';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { Task } from './task.model';
import { TaskService } from './task.service';
import { TaskList, emptyTaskList } from './task-list.model';

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

  taskList: TaskList = emptyTaskList;

  constructor(private taskService: TaskService) {}

  // Load task data and subscribe to events
  ngOnInit(): void {
    this.taskList = this.taskService.getTasks();
  }

  createTask(task: Task) {
    this.taskService.addTask(task);
    this.taskList = this.taskService.getTasks(); // Reload task data after changes
  }
}

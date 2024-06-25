import { Component, Input } from '@angular/core';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskList, emptyTaskList } from '../task-list.model';
import { TaskService } from '../task.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskItemComponent,
    RouterLink
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

  @Input() taskList: TaskList = emptyTaskList;

  constructor(private taskService: TaskService) {}

  onDeleted(taskId: number) {
    this.taskService.deleteTask(taskId);
    this.taskList = this.taskService.getTasks(); // Reload task data after changes
  }
}

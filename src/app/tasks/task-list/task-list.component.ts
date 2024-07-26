import { Component, Input } from '@angular/core';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../task.service';
import { RouterLink } from '@angular/router';
import { BasicTask } from '../task.model';
import { Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskItemComponent,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

  @Input() taskList: Subject<BasicTask[]> = this.taskService.basicTasksSubject;

  constructor(private taskService: TaskService) {}

  onDeleted(taskId: number) {
    this.taskService.deleteTask(taskId);
  }

}

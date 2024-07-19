import { Component, Input, OnDestroy } from '@angular/core';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../task.service';
import { RouterLink } from '@angular/router';
import { BasicTask } from '../task.model';
import { Subscription } from 'rxjs';

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
export class TaskListComponent implements OnDestroy {

  @Input() taskList: BasicTask[] = this.taskService.tasksSubject.getValue();
  private taskListSubscription : Subscription = this.taskService.tasksSubject.subscribe(
    tasks => this.taskList = tasks
  );

  constructor(private taskService: TaskService) {}
  ngOnDestroy(): void {
    this.taskListSubscription.unsubscribe();
  }

  onDeleted(taskId: number) {
    this.taskService.deleteTask(taskId);
    this.taskList = this.taskService.getTasks(); // Reload task data after changes
  }

}

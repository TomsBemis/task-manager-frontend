import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
export class TaskListComponent implements OnInit, OnDestroy {

  @Input() taskList: BasicTask[] = [];

  private taskListSubscription : Subscription = new Subscription();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskListSubscription = this.taskService.basicTasksSubject.subscribe(
      basicTasks => this.taskList = basicTasks
    );
  }

  ngOnDestroy(): void {
    this.taskListSubscription.unsubscribe();
  }

  onDeleted(taskId: number) {
    this.taskService.deleteTask(taskId);
    this.taskList = this.taskService.getTasks(); // Reload task data after changes
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../task.service';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';

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
export class TaskListComponent implements OnInit, OnDestroy {

  taskList = this.taskService.basicTasksSubject;
  taskList$ = this.taskService.basicTasksSubject.asObservable();
  deleteTaskSubscription = new Subscription();
  getEssentialDataSubscription = new Subscription();

  constructor(private taskService: TaskService) {}

  ngOnDestroy(): void {
    this.deleteTaskSubscription.unsubscribe();
    this.getEssentialDataSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // If task list is empty then try to initialize
    if(this.taskList.getValue().length === 0) {
      this.getEssentialDataSubscription = this.taskService.getEssentialData().subscribe(
        essentialData => {
          this.taskList.next(essentialData.tasks);
        }
      )
    }
  }

  onDeleted(taskId: number) {
    this.deleteTaskSubscription = this.taskService.deleteTask(taskId)
    .subscribe(newTaskList => {
      this.taskList.next(newTaskList);
    });
  }

}
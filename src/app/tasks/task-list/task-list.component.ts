import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskItemComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {

  @Input('taskList') tasks!: Task[];

  constructor() {}

  ngOnInit() {

  }
}

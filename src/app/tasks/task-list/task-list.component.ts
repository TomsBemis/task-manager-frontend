import { Component, Input } from '@angular/core';
import { Task } from '../task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskList } from '../task-list.model';

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

  @Input() taskList!: TaskList|undefined;

  constructor() {}

  ngOnInit() {

  }
}

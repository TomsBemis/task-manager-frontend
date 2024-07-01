import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, emptyTask } from '../task.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {

  @Output() taskDeletedEvent = new EventEmitter<void>();

  @Input() taskItem: Task = emptyTask;

  onDeleted() {
    this.taskDeletedEvent.emit();
  }


}

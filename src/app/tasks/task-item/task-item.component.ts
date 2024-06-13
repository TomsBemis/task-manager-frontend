import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskModel } from '../task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {

  @Output() taskDeletedEvent = new EventEmitter<void>();

  @Input() taskItem: TaskModel;

  onDeleted() {
    this.taskDeletedEvent.emit();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task, emptyTask } from '../task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent implements OnInit{
  ngOnInit(): void {
    console.log(this.taskItem);
  }

  @Output() taskDeletedEvent = new EventEmitter<void>();

  @Input() taskItem: Task = emptyTask;

  onDeleted() {
    this.taskDeletedEvent.emit();
  }


}

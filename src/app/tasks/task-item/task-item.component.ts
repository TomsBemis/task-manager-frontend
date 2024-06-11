import { Component, Input } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {

  @Input() taskItem!: Task;
  
  constructor(private taskService: TaskService) {}

  onDeleted(taskTitle: string) {
    this.taskService.taskDeleted.emit(taskTitle);
  }
}

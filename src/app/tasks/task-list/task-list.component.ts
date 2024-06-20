import { Component, Input } from '@angular/core';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskList, emptyTaskList } from '../task-list.model';
import { TaskService } from '../task.service';

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

  @Input() taskList: TaskList = emptyTaskList;

  constructor(private taskService: TaskService) {}

  onDeleted(taskTitle: string) {
    this.taskService.deleteTask(taskTitle);
    this.taskList = this.taskService.getTasks(); // Reload task data after changes
  }
}

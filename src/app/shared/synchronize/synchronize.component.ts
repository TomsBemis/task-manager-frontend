import { Component } from '@angular/core';
import { TaskService } from '../../tasks/task.service';

@Component({
  selector: 'app-synchronize',
  standalone: true,
  imports: [],
  templateUrl: './synchronize.component.html',
  styleUrl: './synchronize.component.scss'
})
export class SynchronizeComponent {

  constructor(private taskService: TaskService){}

  synchronize() {
    this.taskService.fetchDataFromDB();
  }
}

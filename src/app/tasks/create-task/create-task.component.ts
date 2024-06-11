import { Component } from '@angular/core';
import { Task } from '../task.model';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {

  constructor(private taskService: TaskService) {}

  onCreateTask(taskTitleInput: HTMLInputElement, taskDescriptionInput: HTMLInputElement, taskTypeInput: HTMLInputElement, taskStatusInput: HTMLInputElement) {
    // Use references on input elements to get the filled out form data
    this.taskService.taskCreated.emit(
      new Task(
        taskTitleInput.value, 
        taskDescriptionInput.value, 
        taskTypeInput.value, 
        new Date(), 
        taskStatusInput.value
      ));
  }
}



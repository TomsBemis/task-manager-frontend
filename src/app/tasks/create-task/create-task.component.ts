import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Task } from '../task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  @Output() taskCreated = new EventEmitter<any>();

  onCreateTask(taskTitleInput: HTMLInputElement, taskDescriptionInput: HTMLInputElement, taskStatusInput: HTMLInputElement) {
    this.taskCreated.emit(
      new Task(taskTitleInput.value, taskDescriptionInput.value, new Date(), taskStatusInput.value));
  }
}



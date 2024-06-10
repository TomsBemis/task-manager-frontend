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

  newTitle: string = '';
  newDescription: string = '';
  newStatus: string = '';

  onCreateTask() {
    this.taskCreated.emit(
      new Task(this.newTitle, this.newDescription, new Date(), this.newStatus));
  }
}



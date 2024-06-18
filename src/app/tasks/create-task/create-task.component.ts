import { Component, EventEmitter, Output } from '@angular/core';
import { Task, TaskStatus, TaskType } from '../task.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { Validators } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
 
  @Output() taskCreatedEvent = new EventEmitter<Task>();

  taskTypes : {key: string, value: string}[] = [];
  taskStatuses : {key: string, value: string}[] = [];

  createTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      this.validateTitleUnique.bind(this)
    ]), //Custom validator for unique title
    description: new FormControl(),
    type: new FormControl(null, Validators.required),
    createdOn: new FormControl(new Date().toDateString()),
    status: new FormControl(null, Validators.required)
  });

  constructor(private taskService: TaskService) {
    // Map the task type enum to array of keys and values
    Object.keys(TaskType).forEach(taskTypeKey => {
      this.taskTypes.push({
        key : taskTypeKey, 
        value : TaskType[taskTypeKey as keyof typeof TaskType]
      });
    });
    // Map the task status enum to array of keys and values
    Object.keys(TaskStatus).forEach(taskStatusKey => {
      this.taskStatuses.push({
        key : taskStatusKey, 
        value : TaskStatus[taskStatusKey as keyof typeof TaskStatus]
      });
    });
  }

  onSubmit () {

    // Get filled out form data using form group
    this.taskCreatedEvent.emit({
      title: this.createTaskForm.get('title')?.value,
      description: this.createTaskForm.get('description')?.value,
      type: TaskType[this.createTaskForm.get('type')?.value as keyof typeof TaskType],
      createdOn: new Date(),
      status: TaskStatus[this.createTaskForm.get('status')?.value as keyof typeof TaskStatus]
    });

    this.createTaskForm.reset();
  }

  validateTitleUnique(control: FormControl): {[s: string]: boolean} | null {
    if (this.taskService
      .getTasks()
      .tasks
      .flatMap(
        (task: { title: string; }) => {return task.title}
      ).indexOf(control.value) !== -1) {
        return {'titleUnique': true};
    }
    return null;
  }
}



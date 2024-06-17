import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../task.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  
  @Output() taskCreatedEvent = new EventEmitter<Task>();

  createTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      this.validateTitleUnique.bind(this)
    ]), //Custom validator for unique title
    description: new FormControl(),
    type: new FormControl(null, Validators.required),
    createdOn: new FormControl(new Date().toDateString()),
    status: new FormControl('In Progress', Validators.required)
  });

  constructor(private taskService: TaskService) {}

  onSubmit () {

    // Get filled out form data using form group
    this.taskCreatedEvent.emit({
      title: this.createTaskForm.get('title')?.value,
      description: this.createTaskForm.get('description')?.value,
      type: this.createTaskForm.get('type')?.value,
      createdOn: new Date(),
      status: this.createTaskForm.get('status')?.value
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



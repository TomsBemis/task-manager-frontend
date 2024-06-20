import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Task, Option, OptionIndex } from '../task.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
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
export class CreateTaskComponent implements OnInit{
 
  @Output() taskCreatedEvent = new EventEmitter<Task>();

  @Input() taskTypes : Option[] = [];

  @Input() taskStatuses : Option[] = [];

  createTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      this.validateTitleUnique.bind(this)
    ]), //Custom validator for unique title
    description: new FormControl(),
    type: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required)
  });

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {

    // Map task types and statuses from index to arrays
    Object.entries(this.taskService.getTaskTypes()).forEach(taskType => {
      this.taskTypes.push(taskType[1]);
    });
    Object.entries(this.taskService.getTaskStatuses()).forEach(taskStatus => {
      this.taskStatuses.push(taskStatus[1]);
    });
  }

  onSubmit () {


    // Get filled out form data using form group
    this.taskCreatedEvent.emit({
      title: this.createTaskForm.get('title')?.value,
      description: this.createTaskForm.get('description')?.value,
      type: this.taskService.getTaskTypes()[this.createTaskForm.get('type')?.value],
      createdOn: new Date(),
      status: this.taskService.getTaskStatuses()[this.createTaskForm.get('status')?.value],
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



import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Task, Option } from '../task.model';
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
        
    var taskType: Option | undefined = this.taskTypes.find(
      taskType => taskType.value == this.createTaskForm.get('type')?.value
    );
    var taskStatus: Option | undefined = this.taskStatuses.find(
      taskStatus => taskStatus.value == this.createTaskForm.get('status')?.value
    );

    // Get filled out form data using form group
    this.taskCreatedEvent.emit({
      title: this.createTaskForm.get('title')?.value,
      description: this.createTaskForm.get('description')?.value,
      type: taskType!,
      createdOn: new Date(),
      status: taskStatus!,
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



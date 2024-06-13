import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskModel } from '../task.model';
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
export class CreateTaskComponent implements OnInit {
  
  @Output() taskCreatedEvent = new EventEmitter<TaskModel>();

  createTaskForm: FormGroup;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.createTaskForm = new FormGroup({
      'title': new FormControl(null, [
        Validators.required,
        this.validateTitleUnique.bind(this)
      ]), //Custom validator for unique title
      'description': new FormControl(),
      'type': new FormControl(null, Validators.required),
      'createdOn': new FormControl(new Date().toDateString()),
      'status': new FormControl('In Progress', Validators.required)
    });
  }

  onSubmit () {
    // Get filled out form data using form group
    this.taskCreatedEvent.emit(
      new TaskModel(
        this.createTaskForm.get('title').value, 
        this.createTaskForm.get('description').value, 
        this.createTaskForm.get('type').value, 
        new Date(), 
        this.createTaskForm.get('status').value
    ));
  }

  validateTitleUnique(control: FormControl): {[s: string]: boolean} {
    if (this.taskService.getTasks().tasks.flatMap(task => {return task.title}).indexOf(control.value) !== -1) {
      return {'titleUnique': true};
    }
    return null;
  }
}



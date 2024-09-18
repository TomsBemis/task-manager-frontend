import { Component, OnDestroy } from '@angular/core';
import { Option } from '../../shared/option.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { KeyValuePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class CreateTaskComponent implements OnDestroy {

  taskTypes : Option[] = this.taskService.getTaskTypes();
  taskStatuses : Option[] = this.taskService.getTaskStatuses();

  addTaskSubscription : Subscription = new Subscription();

  createTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      this.validateTitleUnique.bind(this)
    ]), //Custom validator for unique title
    description: new FormControl(),
    type: new FormControl(null, Validators.required),
    status: new FormControl(null, Validators.required)
  });

  constructor(private taskService: TaskService, private router: Router) {}
  
  ngOnDestroy(): void {
    this.addTaskSubscription.unsubscribe();
  }

  onSubmit () {
    // Get filled out form data using form group
    
    this.addTaskSubscription = this.taskService.addTask({
      id: 0,
      title: this.createTaskForm.get('title')?.value,
      description: this.createTaskForm.get('description')?.value,
      type: this.taskTypes.find( taskType => 
        taskType.value == this.createTaskForm.get('type')?.value
      ) as Option,
      status: this.taskStatuses.find(taskStatus => 
        taskStatus.value == this.createTaskForm.get('status')?.value
      ) as Option,
      updatedAt: new Date(),
      createdAt: new Date()
    }).subscribe(createdTask => {
      if(createdTask) this.router.navigate(['/tasks', createdTask.id]);
    });
  }

  validateTitleUnique(control: FormControl): {[s: string]: boolean} | null {
    if (this.taskService
      .basicTasksSubject.getValue()
      .flatMap(
        (task: { title: string; }) => {return task.title}
      ).indexOf(control.value) !== -1) {
        return {'titleUnique': true};
    }
    return null;
  }
}



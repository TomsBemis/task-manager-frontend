import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { TaskStatus, TaskType } from '../task.model';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { addTask, TasksActionTypes } from '../../state/tasks/tasks.actions';
import { isTitleUnique } from '../../state/tasks/tasks.selectors';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    TranslateModule
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent implements OnDestroy {
  
  taskTypes: string[] = Object.keys(TaskType);
  taskStatuses: string[] = Object.keys(TaskStatus);

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

  constructor(private router: Router, private store: Store<AppState>) {}
  
  ngOnDestroy(): void {
    this.addTaskSubscription.unsubscribe();
  }

  onSubmit () {
    // Get filled out form data using form group
    
    this.store.dispatch(addTask({
      task: {
        id: 0,
        title: this.createTaskForm.get('title')?.value,
        description: this.createTaskForm.get('description')?.value,
        type: this.createTaskForm.get('type')?.value,
        status: this.createTaskForm.get('status')?.value,
        updatedAt: new Date(),
        createdAt: new Date(),
        assignedUser: null
      }
    }));
  }

  validateTitleUnique(control: FormControl): {[s: string]: boolean} | null {
    this.store.select(isTitleUnique(control.value)).subscribe(unique => {
      return {'titleUnique': unique};
    });
    return null;
  }
}



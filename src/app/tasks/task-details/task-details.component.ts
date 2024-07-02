import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task, Option, emptyTask } from '../task.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit, OnDestroy {

  task: Task | null = emptyTask;
  editMode: boolean = false;
  taskTypes : Option[] = this.taskService.getTaskTypes();
  taskStatuses : Option[] = this.taskService.getTaskStatuses();
  routeParamsSubscription: Subscription = this.route.params.subscribe((params: Params) => {
    this.task = this.taskService.getTask(+params['id']);
  });

  editTaskForm: FormGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    type: new FormControl(),
    status: new FormControl()
  });

  onDeleted(taskId: number) {
    this.taskService.deleteTask(taskId);
    this.router.navigate(['tasks']);
  }

  onEdit() {
    this.editMode = true;
  }
  
  onSubmit () {
    // Get filled out form data using form group

    if(this.task?.id) {
      this.task = this.taskService.updateTask(
        this.task.id,
        {
          id: this.task.id,
          title: this.editTaskForm.get('title')?.value,
          description: this.editTaskForm.get('description')?.value,
          type: this.taskTypes.find( taskType => 
            taskType.value == this.editTaskForm.get('type')?.value
          ) ?? null,
          modiefiedOn: new Date(),
          createdOn: this.task.createdOn,
          status: this.taskStatuses.find(taskStatus => 
            taskStatus.value == this.editTaskForm.get('status')?.value
          ) ?? null,
        }
      );
    }

    this.router.navigate(['tasks']);
  }

  constructor(private router: Router, private route: ActivatedRoute, private taskService: TaskService) {}
  
  ngOnInit(): void {
    
    this.editTaskForm = new FormGroup({
      title: new FormControl(this.task?.title, [
        Validators.required,
        this.validateTitleUnique.bind(this)
      ]), //Custom validator for unique title
      description: new FormControl(this.task?.description),
      type: new FormControl(this.task?.type?.value, Validators.required),
      status: new FormControl(this.task?.status?.value, Validators.required)
    });

  }

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
  }

  validateTitleUnique(control: FormControl): {[s: string]: boolean} | null {

    // Remove the task being edited from the list of tasks
    let otherTasks: Task[] = this.taskService.getTasks().tasks.slice();
    let indexOfCurrentTask = 0;
    
    if (this.task != null) {
      indexOfCurrentTask = this.taskService.getTasks().tasks.indexOf(this.task);
      if(indexOfCurrentTask != -1) {
        otherTasks.splice(
          this
          .taskService
          .getTasks()
          .tasks
          .indexOf(this.task), 1
        );
      }
    }
    if (otherTasks
      .flatMap(
        (task: { title: string; }) => {return task.title}
      ).indexOf(control.value) !== -1) {
        return {'titleUnique': true};
    }
    return null;
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task, Option, BasicTask } from '../task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { map, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    DatePipe
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit, OnDestroy {

  task: Task | null = null;
  editMode: boolean = false;
  taskTypes : Option[] = this.taskService.getTaskTypes();
  taskStatuses : Option[] = this.taskService.getTaskStatuses();
  fetchTaskDetailsSubscription : Subscription = new Subscription();

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

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  
  onSubmit (task : Task) {
    // Get filled out form data using form group

    this.taskService.updateTask(
      task.id,
      {
        id: task.id,
        title: this.editTaskForm.get('title')?.value,
        description: this.editTaskForm.get('description')?.value,
        type: this.taskTypes.find( taskType => 
          taskType.value == this.editTaskForm.get('type')?.value
        ) as Option,
        status: this.taskStatuses.find(taskStatus => 
          taskStatus.value == this.editTaskForm.get('status')?.value
        ) as Option,
        updatedAt: new Date(),
        createdAt: task.createdAt,
      }
    );

    this.router.navigate(['tasks']);  
  }

  constructor(private router: Router, private route: ActivatedRoute, private taskService: TaskService) {}
  
  ngOnInit(): void {
    
    // Get task id from route parameters then pass it as argument for task service
    // set the component task when async method is done
    this.fetchTaskDetailsSubscription = this.route.params.pipe(
      map(params => params['id'] as number),
      switchMap(taskId => {
        return this.taskService.getTask(taskId)
      })).subscribe(responseTask => {
        this.task = responseTask;

        // Fill out edit task form as soon as the task is fetched from BE
        this.editTaskForm = new FormGroup({
          title: new FormControl(this.task?.title, [
            Validators.required,
            this.validateTitleUnique.bind(this)
          ]), //Custom validator for unique title
          description: new FormControl(this.task?.description),
          type: new FormControl(this.task?.type?.value, Validators.required),
          status: new FormControl(this.task?.status?.value, Validators.required)
        });
      });
  }

  ngOnDestroy(): void {
    this.fetchTaskDetailsSubscription.unsubscribe();
  }

  validateTitleUnique(control: FormControl): {[s: string]: boolean} | null {

    // Remove the task being edited from the list of tasks
    let otherTasks: BasicTask[] = this.taskService.getTasks().filter(task => task.id != this.task?.id);
    if (otherTasks
      .flatMap(
        (task: { title: string; }) => {return task.title}
      ).indexOf(control.value) !== -1) {
        return {'titleUnique': true};
    }
    return null;
  }
}

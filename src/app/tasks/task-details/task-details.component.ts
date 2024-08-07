import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task, Option, BasicTask } from '../task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { map, Subscription, switchMap, take } from 'rxjs';

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
  deleteTaskSubscription = new Subscription();
  updateTaskSubscription = new Subscription();

  editTaskForm: FormGroup = new FormGroup({
    title: new FormControl(this.task?.title, [
      Validators.required,
      this.validateTitleUnique.bind(this)
    ]),
    description: new FormControl(),
    type: new FormControl(),
    status: new FormControl()
  });

  onDeleted(taskId: number) {
    this.deleteTaskSubscription = this.taskService.deleteTask(taskId).subscribe(newTaskList => {
      this.taskService.basicTasksSubject.next(newTaskList);
      this.router.navigate(['tasks']);
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  
  onSubmit (task : Task) {
    // Get filled out form data using form group

    if(this.task) {
      this.updateTaskSubscription = this.taskService.updateTask(
        this.task.id,
        {
          id: this.task.id,
          title: this.editTaskForm.get('title')?.value,
          description: this.editTaskForm.get('description')?.value,
          type: this.taskTypes.find( taskType => 
            taskType.value == this.editTaskForm.get('type')?.value
          ) as Option,
          status: this.taskStatuses.find(taskStatus => 
            taskStatus.value == this.editTaskForm.get('status')?.value
          ) as Option,
          updatedAt: new Date(),
          createdAt: this.task.createdAt,
        }
      ).subscribe( updatedTask => {
        if(updatedTask) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/tasks', this.task?.id])});
        }
        else this.router.navigate(['/tasks']);
      });
  
    }    
  }

  constructor(private router: Router, private route: ActivatedRoute, private taskService: TaskService) {}
  ngOnDestroy(): void {
    this.deleteTaskSubscription.unsubscribe();
    this.updateTaskSubscription.unsubscribe();
  }
  
  ngOnInit(): void {
    this.getCurrentTask();
  }

  getCurrentTask() {
    // Get task id from route parameters then pass it as argument for task service
    // set the component task when async method is done
    this.getCurrentTaskSubscription = this.route.params.pipe(
      map(params => params['id'] as number),
      switchMap(taskId => {
        return this.taskService.getTask(taskId)
      }),
      take(1)
    ).subscribe(responseTask => {
        this.task = responseTask;

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

  validateTitleUnique(control: FormControl): {[s: string]: boolean} | null {

    // Remove the task being edited from the list of tasks
    let otherTasks: BasicTask[] = this.taskService.basicTasksSubject.getValue().filter(task => task.id != this.task?.id);
    if (otherTasks
      .flatMap(
        (task: { title: string; }) => {return task.title}
      ).indexOf(control.value) !== -1) {
        return {'titleUnique': true};
    }
    return null;
  }
}

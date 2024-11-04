import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task, BasicTask, TaskStatus, TaskType } from '../task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { map, Subscription, switchMap, take } from 'rxjs';
import { Role, UserData } from '../../users/user.model';
import { AuthService } from '../../auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe,
    DatePipe,
    TranslateModule
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit, OnDestroy {

  taskTypes: string[] = Object.keys(TaskType);
  taskStatuses: string[] = Object.keys(TaskStatus);
  task: Task | null = null;
  editable: boolean = false;
  editMode: boolean = false;
  userRole: string = "";
  userRoles = Role;
  assignableUsers: UserData[] = [];
  deleteTaskSubscription = new Subscription();
  updateTaskSubscription = new Subscription();

  editTaskForm: FormGroup = new FormGroup({
    title: new FormControl(this.task?.title, [
      Validators.required,
      this.validateTitleUnique.bind(this)
    ]),
    description: new FormControl(),
    type: new FormControl(),
    status: new FormControl(),
    assignedUser: new FormControl()
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
  
  onSubmit () {

    // Get filled out form data using form group

    if(this.task) {
      this.updateTaskSubscription = this.taskService.updateTask(
        this.task.id,
        {
          id: this.task.id,
          title: this.editTaskForm.get('title')?.value,
          description: this.editTaskForm.get('description')?.value,
          type: this.editTaskForm.get('type')?.value,
          status: this.editTaskForm.get('status')?.value,
          updatedAt: new Date(),
          createdAt: this.task.createdAt,
          assignedUser: this.editTaskForm.get('assignedUser')?.value
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

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private taskService: TaskService,
    private authService: AuthService,
  ) {}
  
  ngOnDestroy(): void {
    this.deleteTaskSubscription.unsubscribe();
    this.updateTaskSubscription.unsubscribe();
  }
  
  ngOnInit(): void {

    // Set task to be editable if logged in user has the admin role
    let loggedInUser : UserData | null = this.authService.currentUserSubject.getValue();
    if(loggedInUser) {
      if(loggedInUser.roles.includes(Role.admin)) {
        this.editable = true;
        this.userRole = Role.admin
      }
      else if(loggedInUser.roles.includes(Role.manager)) {
        this.editable = true;
        this.userRole = Role.manager;
      }
    }

    this.getCurrentTask();
  }

  getCurrentTask() {
    // Get task id from route parameters then pass it as argument for task service
    // set the component task when async method is done
    this.route.params.pipe(
      map(params => params['id'] as number),
      switchMap(taskId => {
        return this.taskService.getTask(taskId)
      }),
      take(1)
    ).subscribe(response => {
      
      this.task = response.task;
      this.assignableUsers = response.assignableUsers;

      this.editTaskForm = new FormGroup({
        title: new FormControl(this.task?.title, [
          Validators.required,
          this.validateTitleUnique.bind(this)
        ]), //Custom validator for unique title
        description: new FormControl(this.task?.description),
        type: new FormControl(this.task?.type, Validators.required),
        status: new FormControl(this.task?.status, Validators.required),
        assignedUser: new FormControl(this.task?.assignedUser?.id)
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

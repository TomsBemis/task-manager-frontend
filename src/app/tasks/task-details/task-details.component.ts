import { Component, OnDestroy, OnInit } from '@angular/core';
import { Task, Option, BasicTask } from '../task.model';
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

  task: Task = {} as Task;
  editMode: boolean = false;
  taskTypes : Option[] = this.taskService.getTaskTypes();
  taskStatuses : Option[] = this.taskService.getTaskStatuses();

  routeParamsSubscription: Subscription = this.route.params.subscribe((params: Params) => {
    // Retrieve task by id and if one exists set it to component's task
    let taskById = this.taskService.getTask(params['id']);
    if (taskById) this.task = taskById;
    else throw new Error("");
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

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  
  onSubmit () {
    // Get filled out form data using form group
    let taskType : Option | undefined = this.taskTypes.find( taskType => 
      taskType.value == this.editTaskForm.get('type')?.value
    );
    let taskStatus : Option | undefined = this.taskStatuses.find(taskStatus => 
      taskStatus.value == this.editTaskForm.get('status')?.value
    );

    if (!taskType || !taskStatus) {
      throw new Error("");
    }

    this.taskService.updateTask(
      this.task.id,
      {
        id: this.task.id,
        title: this.editTaskForm.get('title')?.value,
        description: this.editTaskForm.get('description')?.value,
        type: taskType,
        status: taskStatus,
        modifiedOn: new Date(),
        createdOn: this.task.createdOn,
      }
    );

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
    let otherTasks: BasicTask[] = this.taskService.getTasks().tasks.filter(task => task.id != this.task?.id);
    if (otherTasks
      .flatMap(
        (task: { title: string; }) => {return task.title}
      ).indexOf(control.value) !== -1) {
        return {'titleUnique': true};
    }
    return null;
  }
}

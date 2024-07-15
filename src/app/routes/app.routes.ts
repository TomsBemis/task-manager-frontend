import { Routes } from '@angular/router';
import { CreateTaskComponent } from '../tasks/create-task/create-task.component';
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskDetailsComponent } from '../tasks/task-details/task-details.component';

export const appRoutes: Routes = [
    { path: '', component: TaskListComponent },
    { path: 'tasks/create', component: CreateTaskComponent },
    { path: 'tasks', component: TaskListComponent },
    { path: 'tasks/:id', component: TaskDetailsComponent },

];

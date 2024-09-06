import { Routes } from '@angular/router';
import { CreateTaskComponent } from '../tasks/create-task/create-task.component';
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskDetailsComponent } from '../tasks/task-details/task-details.component';
import { LoginComponent } from '../auth/login/login.component';
import { authGuard } from '../auth/auth.guard';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'tasks'},
    { path: 'tasks/create', component: CreateTaskComponent , canActivate: [authGuard]},
    { path: 'tasks', component: TaskListComponent , canActivate: [authGuard]},
    { path: 'tasks/:id', component: TaskDetailsComponent , canActivate: [authGuard]},

    { path: 'login', component: LoginComponent }
];

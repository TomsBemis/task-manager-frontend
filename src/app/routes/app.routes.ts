import { Routes } from '@angular/router';
import { CreateTaskComponent } from '../tasks/create-task/create-task.component';
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskDetailsComponent } from '../tasks/task-details/task-details.component';
import { LoginComponent } from '../auth/login/login.component';
import { authGuard } from '../guards/auth.guard';
import { UserDetailsComponent } from '../users/user-details/user-details.component';
import { UserListComponent } from '../users/user-list/user-list.component';
import { userRoleGuard } from '../guards/userRole.guard';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'tasks'},
    { path: 'tasks/create', component: CreateTaskComponent , canActivate: [authGuard, userRoleGuard(["ADMIN"],true)]},
    { path: 'tasks', component: TaskListComponent , canActivate: [authGuard]},
    { path: 'tasks/:id', component: TaskDetailsComponent , canActivate: [authGuard]},

    { path: 'login', component: LoginComponent },
    
    { path: 'users/:userId', component: UserDetailsComponent, canActivate: [authGuard]},
    { path: 'users', component: UserListComponent, canActivate: [authGuard]},
];

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as TasksActions from "./tasks.actions";
import { Router } from '@angular/router';

@Injectable()
export class TasksEffects {
    constructor(private router: Router, private actions$: Actions) {}

    addTaskSuccess$ = createEffect(() => 
      this.actions$.pipe(
        ofType(TasksActions.addTask),
        tap(({ task: createdTask }) => { this.router.navigate(['/tasks', createdTask.id]) }),
      ),
      { dispatch: false }
    );
}
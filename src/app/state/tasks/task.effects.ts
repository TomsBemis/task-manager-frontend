import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { TaskService } from "../../tasks/task.service";
import * as TaskActions from "./task.actions";

@Injectable()
export class TaskEffects {
    constructor(private actions$: Actions, private taskService: TaskService) {}

    addTasks$ = createEffect(() => this.actions$.pipe(
        ofType(TaskActions.TaskActionTypes.addTask),
        exhaustMap((task) => this.taskService.addTask(task)
          .pipe(
            map(movies => ({ type: TaskActions.TaskActionTypes.addTask, payload: movies })),
            catchError(() => EMPTY)
          ))
        )
      );
}
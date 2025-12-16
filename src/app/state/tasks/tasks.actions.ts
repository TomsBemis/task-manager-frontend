import { createAction, props } from '@ngrx/store';
import { Task } from '../../tasks/task.model';

export enum TasksActionTypes {
    addTask = '[Tasks] Add',
    updateTask = '[Tasks] Update',
    deleteTask = '[Tasks] Delete'
}

export const addTask = createAction(TasksActionTypes.addTask, props<{ task: Task }>());
export const updateTask = createAction(TasksActionTypes.updateTask);
export const deleteTask = createAction(TasksActionTypes.deleteTask);
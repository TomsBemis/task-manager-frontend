import { createAction, props } from '@ngrx/store';
import { Task } from '../../tasks/task.model';

export enum TaskActionTypes {
    addTask = '[Task Component] Add',
    updateTask = '[Task Component] Update',
    deleteTask = '[Task Component] Delete'
}

export const addTask = createAction(TaskActionTypes.addTask, props<{ task: Task }>());
export const updateTask = createAction(TaskActionTypes.updateTask);
export const deleteTask = createAction(TaskActionTypes.deleteTask);
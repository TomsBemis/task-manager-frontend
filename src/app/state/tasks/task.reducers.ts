import { BasicTask, Task } from "../../tasks/task.model";
import { createReducer, on } from '@ngrx/store';
import * as TaskActions from "./task.actions";

export interface TaskState {
    tasks: Task[]
}

export const initialState: TaskState = {
    tasks: []
};

export const taskReducer = createReducer(
    initialState,
    on(TaskActions.addTask, (state, { task }) => ({ ... state, tasks: [...state.tasks, task]}))
);
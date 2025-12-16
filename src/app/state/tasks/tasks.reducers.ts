import { BasicTask, Task } from "../../tasks/task.model";
import { createReducer, on } from '@ngrx/store';
import * as TaskActions from "./tasks.actions";

export interface TasksState {
    tasks: Task[]
}

export const initialState: TasksState = {
    tasks: []
};

export const tasksReducer = createReducer(
    initialState,
    on(TaskActions.addTask, (state, { task }) => ({ ... state, tasks: [...state.tasks, task]}))
);
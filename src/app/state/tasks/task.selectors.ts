import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { TaskState } from "./task.reducers";

export const getTasks = (state: AppState) => state.tasks;
export const getAllTasks = createSelector(
    getTasks,
    (state: TaskState) => state.tasks
);
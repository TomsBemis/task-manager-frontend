import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { TasksState } from "./tasks.reducers";

export const getTasks = (state: AppState) => state.tasks;
export const getAllTasks = createSelector(
    getTasks,
    (state: TasksState) => state.tasks
);
export const isTitleUnique = (title: string) => createSelector(getAllTasks, (tasks) =>
    !tasks.some(task => task.title === title)
);
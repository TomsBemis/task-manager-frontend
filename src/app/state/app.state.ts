import { Action, ActionReducer } from "@ngrx/store";
import { tasksReducer, TasksState } from "./tasks/tasks.reducers";
import { TasksEffects } from "./tasks/tasks.effects";

export interface AppState {
    tasks: TasksState;
}

export interface AppStore {
    todo: ActionReducer<TasksState, Action>;
  }
  
  export const appStore: AppStore = {
    todo: tasksReducer
  }
  
  export const appEffects = [TasksEffects];
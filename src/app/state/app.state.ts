import { Action, ActionReducer } from "@ngrx/store";
import { taskReducer, TaskState } from "./tasks/task.reducers";
import { TaskEffects } from "./tasks/task.effects";

export interface AppState {
    tasks: TaskState;
}

export interface AppStore {
    todo: ActionReducer<TaskState, Action>;
  }
  
  export const appStore: AppStore = {
    todo: taskReducer
  }
  
  export const appEffects = [TaskEffects];
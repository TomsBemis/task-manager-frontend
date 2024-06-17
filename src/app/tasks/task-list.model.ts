import { Task } from "./task.model";

export interface TaskList {
    tasks: Task[]
}

export const emptyTaskList: TaskList = {
    tasks: []
};
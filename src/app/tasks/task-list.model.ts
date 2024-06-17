import { Task } from "./task.model";

export interface TaskList {
    tasks: Task[]
}

export let emptyTaskList: TaskList = {
    tasks: []
};
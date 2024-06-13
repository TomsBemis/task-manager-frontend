import { Task } from "./task.model";

export interface TaskList {
    tasks: Task[];
}
export class TaskListModel implements TaskList {
    constructor(
        public tasks: Task[]
    ) {}
}
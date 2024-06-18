export enum TaskType {
    STORY = "Story",
    TASK = "Task",
    SUBTASK = "Subtask"
}

export enum TaskStatus {
    IN_PROGRESS = "In Progress",
    FIX_IN_DEV = "Fix in dev",
    OBSOLETE = "Obsolete",
    DONE = "Done"
}

export interface Task {
    title: string, 
    description: string, 
    type: TaskType | null, 
    createdOn: Date, 
    status: TaskStatus | null
}

export const emptyTask: Task = {
    title: '',
    description: '',
    type: null,
    createdOn: new Date(),
    status: null
}
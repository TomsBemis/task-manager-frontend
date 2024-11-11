import { UserData } from '../users/user.model';

export enum TaskType {
    SUBTASK = "subtask",
    STORY = "story",
    TASK = "task"
}

export enum TaskStatus {
    FIX_IN_DEV = "fixInDev",
    OBSOLETE = "obsolete",
    IN_PROGRESS = "inProgress",
    DONE = "done"
}

export interface Task {
    id: number,
    title: string, 
    description: string, 
    type: TaskType, 
    status: TaskStatus, 
    createdAt: Date, 
    updatedAt: Date,
    assignedUser: UserData | null
}

export interface BasicTask {
    id: number,
    title: string,  
    type: TaskType,
}
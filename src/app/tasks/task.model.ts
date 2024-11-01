import { UserData } from '../users/user.model';

export enum TaskType {
    subtask = "subtask",
    story = "story",
    task = "task"
}

export enum TaskStatus {
    fixInDev = "fixInDev",
    obsolete = "obsolete",
    inProgress = "inProgress",
    done = "done"
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
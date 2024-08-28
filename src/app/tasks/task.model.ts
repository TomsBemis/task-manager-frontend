import { Option } from '../shared/option.model';

export interface Task {
    id: number,
    title: string, 
    description: string, 
    type: Option, 
    status: Option
    createdAt: Date, 
    updatedAt: Date
}
export interface BasicTask {
    id: number,
    title: string,  
    type: Option,
}

export interface TaskData { 
    tasks: Task[]; 
    taskTypes: Option[]; 
    taskStatuses: Option[]; 
}
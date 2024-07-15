// Data structure used for TaskType and TaskStatus attributes
export type Option = {
    value: string,
    displayName: string
}

export interface Task {
    id: number,
    title: string, 
    description: string, 
    type: Option, 
    status: Option
    createdOn: Date, 
    modifiedOn: Date
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
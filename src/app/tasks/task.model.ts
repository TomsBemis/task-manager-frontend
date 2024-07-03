// Data structure used for TaskType and TaskStatus attributes
export type Option = {
    value: string,
    displayName: string
}

export interface Task {
    id: number,
    title: string, 
    description: string, 
    type: Option | null, 
    createdOn: Date, 
    modifiedOn: Date, 
    status: Option | null
}
export interface BasicTask {
    id: number,
    title: string,  
    type: Option | null,
}

export const emptyTask: Task = {
    id: 0,
    title: '',
    description: '',
    type: null,
    createdOn: new Date(),
    modifiedOn: new Date(),
    status: null
}

export const emptyBasicTask: BasicTask = {
    id: 0,
    title: '',
    type: null,
}
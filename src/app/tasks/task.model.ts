// Data structure used for TaskType and TaskStatus attributes
export type Option = {
    value: string,
    displayName: string
}

export interface Task {
    title: string, 
    description: string, 
    type: Option | null, 
    createdOn: Date, 
    status: Option | null
}

export const emptyTask: Task = {
    title: '',
    description: '',
    type: null,
    createdOn: new Date(),
    status: null
}
// Data structure used for TaskType and TaskStatus attributes
export type Option = {
    value: string,
    displayName: string
}

export interface Task {
    id: number | null,
    title: string, 
    description: string, 
    type: Option | null, 
    createdOn: Date, 
    status: Option | null
}

export const emptyTask: Task = {
    id: null,
    title: '',
    description: '',
    type: null,
    createdOn: new Date(),
    status: null
}
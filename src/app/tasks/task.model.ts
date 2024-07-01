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
    status: Option | null
}

export const emptyTask: Task = {
    id: 0,
    title: '',
    description: '',
    type: null,
    createdOn: new Date(),
    status: null
}
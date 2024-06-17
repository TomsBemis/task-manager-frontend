export interface Task {
    title: string, 
    description: string, 
    type: string, 
    createdOn: Date, 
    status: string
}

export const emptyTask: Task = {
    title: '',
    description: '',
    type: '',
    createdOn: new Date(),
    status: ''
}
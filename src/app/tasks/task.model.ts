export interface Task {
    title: string, 
    description: string, 
    type: string, 
    createdOn: Date, 
    status: string
}

export let emptyTask: Task = {
    title: '',
    description: '',
    type: '',
    createdOn: new Date(),
    status: ''
}
export interface Task {
    title: string, 
    description: string, 
    type: string, 
    createdOn: Date, 
    status: string
}

export class TaskModel implements Task {
    constructor(
        public title: string, 
        public description: string, 
        public type: string, 
        public createdOn: Date, 
        public status: string
    ) {}
}
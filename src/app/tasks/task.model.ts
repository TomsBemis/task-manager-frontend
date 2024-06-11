export class Task {
    constructor(
        public title: string, 
        public description: string, 
        public type: string, 
        public createdOn: Date, 
        public status: string
    ) {}
}
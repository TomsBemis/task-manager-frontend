export class Task {
    constructor(
        public title: string, 
        public description: string, 
        public createdOn: Date, 
        public status: string
    ) {}
}
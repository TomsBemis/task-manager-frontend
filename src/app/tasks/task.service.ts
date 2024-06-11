import { EventEmitter } from "@angular/core";
import { Task } from "./task.model";
import taskData from '../../assets/tasks.json';

export class TaskService {

    private static taskDataUrl = './assets/tasks.json';

    taskCreated = new EventEmitter<Task>();
    taskDeleted = new EventEmitter<string>();
    
    private tasks: Task[] = [];

    constructor() {
        this.loadTaskData();
    }

    private loadTaskData(){
        taskData.forEach(taskElementData => {
            this.tasks.push(new Task(
                taskElementData.title, 
                taskElementData.description, 
                new Date(taskElementData.createdOn),
                taskElementData.status
            ));
        });
    }

    public getTasks() {
        return this.tasks.slice();
    }

    public addTask(task: Task) {
        this.tasks.push(task);
    }

    public deleteTask(taskTitle: string) {
        for (let index = 0; index < this.tasks.length; index++) {
            const task = this.tasks[index];
            if (task.title === taskTitle) this.tasks.splice(index, 1);
        }
    }
}
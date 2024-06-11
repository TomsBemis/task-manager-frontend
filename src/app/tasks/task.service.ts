import { EventEmitter } from "@angular/core";
import { Task } from "./task.model";
import taskData from '../../assets/tasks.json';

export class TaskService {

    taskCreated = new EventEmitter<Task>();
    taskDeleted = new EventEmitter<string>();
    
    private tasks: Task[] = [];

    constructor() {
        this.loadTaskData();
    }

    private loadTaskData(){

        // JSON data needs to be parsed because of complex objects like Date
        taskData.forEach(taskElementData => {
            this.tasks.push(new Task(
                taskElementData.title, 
                taskElementData.description, 
                taskElementData.type,
                new Date(taskElementData.createdOn),
                taskElementData.status
            ));
        });
    }

    public getTasks() {
        return this.tasks.slice();  // Return a copy of the private array
    }

    public addTask(task: Task) {
        this.tasks.push(task);
    }

    public deleteTask(taskTitle: string) {
        // Task title is it's unique identifier (needs validation on creation)
        for (let index = 0; index < this.tasks.length; index++) {
            const task = this.tasks[index];
            if (task.title === taskTitle) this.tasks.splice(index, 1);
        }
    }
}
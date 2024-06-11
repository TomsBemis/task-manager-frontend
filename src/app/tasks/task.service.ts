import { EventEmitter } from "@angular/core";
import { Task } from "./task.model";
import taskData from '../../assets/tasks.json';
import { TaskList } from "./task-list.model";

export class TaskService {

    taskCreated = new EventEmitter<Task>();
    taskDeleted = new EventEmitter<string>();
    
    private taskList: TaskList | undefined;

    constructor() {
        this.loadTaskData();
    }

    private loadTaskData(){

        let taskArray: Task[] = [];

        // JSON data needs to be parsed because of complex objects like Date
        taskData.forEach(taskElementData => {
            taskArray.push(new Task(
                taskElementData.title, 
                taskElementData.description, 
                taskElementData.type,
                new Date(taskElementData.createdOn),
                taskElementData.status
            ));
        });
        
        this.taskList = new TaskList(taskArray);
    }

    public getTasks() {
        return this.taskList;
    }

    public addTask(task: Task) {
        this.taskList?.tasks.push(task);
    }

    public deleteTask(taskTitle: string) {
        // Task title is it's unique identifier (needs validation on creation)
        if (this.taskList?.tasks != undefined) {
            for (let index = 0; index < this.taskList.tasks.length; index++) {
                const task = this.taskList.tasks[index];
                if (task.title === taskTitle) this.taskList.tasks.splice(index, 1);
            }
        }
    }
}
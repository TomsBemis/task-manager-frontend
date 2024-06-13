import { EventEmitter } from "@angular/core";
import { TaskModel } from "./task.model";
import taskData from '../../assets/tasks.json';
import { TaskListModel } from "./task-list.model";

export class TaskService {
    
    private taskList: TaskListModel;

    constructor() {
        this.loadTaskData();
    }

    private loadTaskData(){

        let taskArray: TaskModel[] = [];

        // JSON data needs to be parsed because of complex objects like Date
        taskData.forEach(taskElementData => {
            taskArray.push(new TaskModel(
                taskElementData.title, 
                taskElementData.description, 
                taskElementData.type,
                new Date(taskElementData.createdOn),
                taskElementData.status
            ));
        });
        
        this.taskList = new TaskListModel(taskArray);
    }

    public getTasks() {
        return this.taskList;
    }

    public addTask(task: TaskModel) {
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
import { Task, Option } from "./task.model";
import taskData from '../../assets/tasks.json';
import { TaskList, emptyTaskList } from "./task-list.model";
import { IdGeneratorService } from "./id-generator-service";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable()
export class TaskService {
    
    private taskList: TaskList = emptyTaskList;
    
    private taskTypes: Option[] = taskData.taskTypes;
    
    private taskStatuses: Option[] = taskData.taskStatuses;

    constructor(private idGeneratorService: IdGeneratorService) {
        this.loadTaskData();
    }

    private loadTaskData(){

        let taskArray: Task[] = [];
        
        // Load tasks
        taskData.tasks.forEach(taskElementData => {
            taskArray.push({
                id: this.idGeneratorService.generateId(),
                title: taskElementData.title,
                description: taskElementData.description,
                type: this.taskTypes.find(taskType => taskType.value == taskElementData.type) ?? null,
                createdOn: new Date(taskElementData.createdOn),
                modifiedOn: new Date(taskElementData.modifiedOn),
                status: this.taskStatuses.find(taskStatus => taskStatus.value == taskElementData.status) ?? null
            });
        });
        
        this.taskList.tasks = taskArray;
    }

    public getTasks() {
        return {tasks: this.taskList.tasks.slice()};
    }

    public getTask(taskId: number): Task | null {
        return this.taskList?.tasks?.find(task => {
            return task.id == taskId;
        }) ?? null;
    }

    public addTask(task: Task) {
        task.id = this.idGeneratorService.generateId();
        this.taskList?.tasks.push(task);
    }

    public updateTask(id: number, editedTask: Task){

        // Update the task if the ids match

        this.taskList.tasks = this.taskList.tasks.map((task: Task) => {
            if(task.id === id) task = editedTask;
            return task
        })
    }

    public deleteTask(taskId: number) {
        // Task title is it's unique identifier (needs validation on creation)
        if (this.taskList?.tasks != undefined) {
            for (let index = 0; index < this.taskList.tasks.length; index++) {
                const task = this.taskList.tasks[index];
                if (task.id === taskId) {
                    this.taskList.tasks.splice(index, 1);
                    break;
                }
            }
        }
    }

    public getTaskTypes() {
        return this.taskTypes;
    }

    public getTaskStatuses() {
        return this.taskStatuses;
    }
}
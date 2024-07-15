import { Task, Option, BasicTask } from "./task.model";
import { IdGeneratorService } from "./id-generator-service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { beApiRoutes } from "../routes/be-api.routes";

@Injectable()
export class TaskService {
    
    private taskTypes: Option[] = [];
    private taskStatuses: Option[] = [];
    private tasks: Task[] = [];    

    constructor(private idGeneratorService: IdGeneratorService, private httpClient: HttpClient) {
        this.fetchDataFromDB();
    }

    private fetchDataFromDB() {
        // Get task types, task statuses and tasks from DB
        this.httpClient.get<Option[]>(beApiRoutes.taskStatuses).subscribe(responseTaskStatuses => {
            this.taskStatuses = responseTaskStatuses;  
        });

        this.httpClient.get<Option[]>(beApiRoutes.taskTypes).subscribe(responseTaskTypes => {
            this.taskTypes = responseTaskTypes;            
        });

        this.httpClient.get<Task[]>(beApiRoutes.tasks).subscribe(responseTasks => {
            this.tasks = responseTasks;            
        });
    }

    private convertTaskToBasicTask(task: Task) : BasicTask {
        return { 
            id: task.id,
            title: task.title,
            type: task.type
        };
    }

    private convertBasicTaskToTask(basicTask: BasicTask) : Task | null {
        let taskIndex: number = this.tasks.findIndex(task => task.id == basicTask.id);
        if(taskIndex === -1) return null;
        return this.tasks[taskIndex];
    }

    private convertTasksToBasicTasks(tasks: Task[]) : BasicTask[] {
        let basicTasks : BasicTask[] = [];
        this.tasks.forEach(task => basicTasks.push(this.convertTaskToBasicTask(task)));
        return basicTasks;
    }

    public getTasks() : BasicTask[] {
        return this.convertTasksToBasicTasks(this.tasks).slice()
        .sort(
            (taskA, taskB) => {
                return (taskA.title < taskB.title) ? -1 : (taskA.title > taskB.title) ? 1 : 0
        });
    }

    public getTask(taskId: number): Task | null {
        return this.tasks?.find(task => {
            return task.id == taskId;
        }) ?? null;
    }

    public addTask(task: Task) {
        task.id = this.idGeneratorService.generateId();
        this.tasks.push(task);
    }

    public updateTask(id: number, editedTask: Task){
        // Update the task if the ids match
        this.tasks = this.tasks.map((task: Task) => {
            if(task.id === id) task = editedTask;
            return task
        })
    }

    public deleteTask(taskId: number) {
        // Task title is it's unique identifier (needs validation on creation)
        if (this.tasks) this.tasks.splice(this.tasks.findIndex(task => task.id == taskId), 1);
    }

    public getTaskTypes() {
        return this.taskTypes;
    }

    public getTaskStatuses() {
        return this.taskStatuses;
    }
}
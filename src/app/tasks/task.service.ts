import { Task, Option, BasicTask } from "./task.model";
import { IdGeneratorService } from "./id-generator-service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { beApiRoutes } from "../routes/be-api.routes";
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TaskService {
    
    public taskTypesSubject = new BehaviorSubject<Option[]>([]);
    public taskStatusesSubject = new BehaviorSubject<Option[]>([]);
    public tasksSubject = new BehaviorSubject<BasicTask[]>([]);

    constructor(private idGeneratorService: IdGeneratorService, private httpClient: HttpClient) {
        this.fetchDataFromDB();
    }

    private fetchDataFromDB() {
        // Get task types, task statuses and tasks from DB
        this.httpClient.get<Option[]>(beApiRoutes.taskStatuses).subscribe(responseTaskStatuses => {
            this.taskStatusesSubject.next(responseTaskStatuses);  
        });

        this.httpClient.get<Option[]>(beApiRoutes.taskTypes).subscribe(responseTaskTypes => {
            this.taskTypesSubject.next(responseTaskTypes);           
        });

        this.httpClient.get<Task[]>(beApiRoutes.tasks).subscribe(responseTasks => {
            this.tasksSubject.next(responseTasks);    
        });
    }

    private convertTaskToBasicTask(task: Task) : BasicTask {
        return { 
            id: task.id,
            title: task.title,
            type: task.type
        };
    }

    public getTasks() : BasicTask[] {
        this.httpClient.get<Task[]>(beApiRoutes.tasks).subscribe(responseTasks => {
            this.tasksSubject.next(responseTasks);    
        });
        return this.tasksSubject.getValue().slice()
        .sort(
            (taskA, taskB) => {
                return (taskA.title < taskB.title) ? -1 : (taskA.title > taskB.title) ? 1 : 0
        });
    }

    public getTask(taskId: number): any {
        return this.tasksSubject.getValue()?.find(task => {
            return task.id == taskId;
        }) ?? null;
    }

    public addTask(task: Task) {
        task.id = this.idGeneratorService.generateId();
        this.tasksSubject.getValue().push(task);
    }

    public updateTask(id: number, editedTask: Task){
    }

    public deleteTask(taskId: number) {
        // Task title is it's unique identifier (needs validation on creation)
        this.tasksSubject.next(
            this.tasksSubject.getValue().splice(
                this.tasksSubject.getValue().findIndex(task => task.id == taskId), 
                1
            )
        );
    }

    public getTaskTypes() {
        return this.taskTypesSubject.getValue();
    }

    public getTaskStatuses() {
        return this.taskStatusesSubject.getValue();
    }
}
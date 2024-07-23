import { Task, Option, BasicTask } from "./task.model";
import { IdGeneratorService } from "./id-generator-service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { beApiRoutes } from "../routes/be-api.routes";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TaskService {
    
    private taskTypesSubject = new BehaviorSubject<Option[]>([]);
    private taskStatusesSubject = new BehaviorSubject<Option[]>([]);
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    public basicTasksSubject = new BehaviorSubject<BasicTask[]>([]);

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

        this.basicTasksSubject.next(this.getTasks());
    }

    private convertTaskToBasicTask(task: Task) : BasicTask {
        return { 
            id: task.id,
            title: task.title,
            type: task.type
        };
    }

    private convertBasicTaskToTask(basicTask: BasicTask) : Task | null {
        let taskIndex: number = this.tasksSubject.getValue().findIndex(task => task.id == basicTask.id);
        if(taskIndex === -1) return null;
        return this.tasksSubject.getValue()[taskIndex];
    }

    private convertTasksToBasicTasks(tasks: Task[]) : BasicTask[] {
        let basicTasks : BasicTask[] = [];
        this.tasksSubject.getValue().forEach(task => basicTasks.push(this.convertTaskToBasicTask(task)));
        return basicTasks;
    }

    public getTasks() : BasicTask[] {
        return this.convertTasksToBasicTasks(this.tasksSubject.getValue()).slice()
        .sort(
            (taskA, taskB) => {
                return (taskA.title < taskB.title) ? -1 : (taskA.title > taskB.title) ? 1 : 0
        });
    }

    public getTask(taskId: number): Observable<Task | null> {
        return this.httpClient.get<Task | null>(beApiRoutes.taskDetails + taskId);
    }

    public addTask(task: Task) {
        let oldTaskList = this.tasksSubject.getValue().slice();
        this.httpClient.post<Task | null>(beApiRoutes.tasks, task)
        .subscribe(createdTask => {
            if(createdTask) {
                oldTaskList.push(createdTask);
                this.tasksSubject.next(oldTaskList);
                this.basicTasksSubject.next(this.getTasks());
            }
        });
    }

    public updateTask(id: number, editedTask: Task){
        // Update the task if the ids match
        this.tasksSubject.next(this.tasksSubject.getValue().map((task: Task) => {
            if(task.id === id) task = editedTask;
            return task
        }));
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
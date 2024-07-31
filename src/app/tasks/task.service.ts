import { Task, Option, BasicTask, TaskData } from "./task.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { beApiRoutes } from "../routes/be-api.routes";
import { BehaviorSubject, first, Observable, tap } from 'rxjs';

@Injectable()
export class TaskService{
    
    private taskTypes : Option[] = [];
    private taskStatuses : Option[] = [];
    public basicTasksSubject = new BehaviorSubject<BasicTask[]>([]);
    public basicTasksObservable$ = this.basicTasksSubject.asObservable();

    constructor(private httpClient: HttpClient) {
        this.getEssentialData();
    }

public getEssentialData() : Observable<TaskData> {
        // Get task types, task statuses and tasks from DB
        return this.httpClient.get<TaskData>(beApiRoutes.essentialTaskData).pipe(
            first(),
            tap(essentialData => {
                this.taskStatuses = essentialData.taskStatuses;
                this.taskTypes = essentialData.taskTypes;
                this.basicTasksSubject.next(essentialData.tasks);
            }));
    }

    public getTasks() : Observable<Task[]> {
        return this.httpClient.get<Task[]>(beApiRoutes.tasks).pipe(
            first(),
            tap(responseTasks => {
                this.basicTasksSubject.next(responseTasks.sort(
                    (taskA, taskB) => {
                        return (taskA.title < taskB.title) ? -1 : (taskA.title > taskB.title) ? 1 : 0
                }));
            })
        );
    }

    public getTask(taskId: number): Observable<Task | null> {
        return this.httpClient.get<Task | null>(beApiRoutes.taskDetails + taskId);
    }

    public addTask(task: Task): Observable<Task | null>{
        let oldTaskList = this.basicTasksSubject.getValue();
        return this.httpClient.post<Task | null>(beApiRoutes.tasks, task)
        .pipe(
            first(),
            tap(createdTask => {
                if(createdTask) {
                    oldTaskList.push(createdTask);
                    this.basicTasksSubject.next(oldTaskList);
                }
            })
        );
    }

public updateTask(taskId: number, editedTask: Task) : Observable<Task | null>{
        // Update the task if the ids match
        return this.httpClient.patch<Task | null>(beApiRoutes.taskDetails + taskId, editedTask)
        .pipe(
            first(),
            tap(updatedTask => {
                if(updatedTask) {
                    this.basicTasksSubject.next(this.basicTasksSubject.getValue().map(task => {
                        if(task.id == taskId) return updatedTask;
                        return task;
                    }));
                }
            })
        );
    }

    public deleteTask(taskId: number) : Observable<BasicTask[]> {
        return this.httpClient.delete<BasicTask[]>(beApiRoutes.taskDetails + taskId);
    }

    public getTaskTypes() {
        return this.taskTypes;
    }

    public getTaskStatuses() {
        return this.taskStatuses;
    }
}
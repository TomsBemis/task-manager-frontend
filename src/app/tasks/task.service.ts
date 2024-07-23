import { Task, Option, BasicTask } from "./task.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { beApiRoutes } from "../routes/be-api.routes";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TaskService {
    
    private taskTypes : Option[] = [];
    private taskStatuses : Option[] = [];
    private tasks : Task[] = []
    public basicTasksSubject = new BehaviorSubject<BasicTask[]>([]);

    constructor(private httpClient: HttpClient) {
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

    public getTask(taskId: number): Observable<Task | null> {
        return this.httpClient.get<Task | null>(beApiRoutes.taskDetails + taskId);
    }

    public addTask(task: Task) {
        let oldTaskList = this.tasks.slice();
        this.httpClient.post<Task | null>(beApiRoutes.tasks, task)
        .subscribe(createdTask => {
            if(createdTask) {
                oldTaskList.push(createdTask);
                this.tasks = oldTaskList;
                this.basicTasksSubject.next(this.getTasks());
            }
        });
    }

    public updateTask(id: number, editedTask: Task){
        // Update the task if the ids match
        this.tasks = this.tasks.map((task: Task) => {
            if(task.id === id) task = editedTask;
            return task
        });
    }

    public deleteTask(taskId: number) {
        // Task title is it's unique identifier (needs validation on creation)
        this.tasks = this.tasks.splice(
                this.tasks.findIndex(task => task.id == taskId), 
                1
            );
    }

    public getTaskTypes() {
        return this.taskTypes;
    }

    public getTaskStatuses() {
        return this.taskStatuses;
    }
}
import { Task, Option, BasicTask } from "./task.model";
import taskData from '../../assets/tasks.json';
import { IdGeneratorService } from "./id-generator-service";
import { Injectable } from "@angular/core";

@Injectable()
export class TaskService {
    
    private tasks: Task[] = [];
    
    private taskTypes: Option[] = taskData.taskTypes;
    private taskStatuses: Option[] = taskData.taskStatuses;

    constructor(private idGeneratorService: IdGeneratorService) {
        this.loadTaskData();
    }

    private loadTaskData(){

        let generatedId = 0;

        taskData.tasks.forEach(taskElementData => {

            generatedId = this.idGeneratorService.generateId();

            this.tasks.push({
                id: generatedId,
                title: taskElementData.title,
                description: taskElementData.description,
                type: this.taskTypes.find( taskType => 
                    taskType.value == taskElementData.type
                ) as Option,
                status: this.taskStatuses.find( taskStatus => 
                    taskStatus.value == taskElementData.status
                ) as Option,
                createdOn: new Date(taskElementData.createdOn),
                modifiedOn: new Date(taskElementData.modifiedOn)
            });
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

    public getTasks() : {tasks: BasicTask[]} {
        // Sort tasks alphabetically
        return {
            tasks: this.convertTasksToBasicTasks(this.tasks).slice()
            .sort(
                (taskA, taskB) => {
                    return (taskA.title < taskB.title) ? -1 : (taskA.title > taskB.title) ? 1 : 0
                }
            )};
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
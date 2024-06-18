import { Task, TaskStatus, TaskType } from "./task.model";
import taskData from '../../assets/tasks.json';
import { TaskList, emptyTaskList } from "./task-list.model";

export class TaskService {
    
    private taskList: TaskList = emptyTaskList;

    constructor() {
        this.loadTaskData();
    }

    private loadTaskData(){

        let taskArray: Task[] = [];

        // JSON data needs to be parsed because of complex objects like Date
        taskData.forEach(taskElementData => {
            taskArray.push({
                title: taskElementData.title,
                description: taskElementData.description,
                type: TaskType[taskElementData.type as keyof typeof TaskType],
                createdOn: new Date(taskElementData.createdOn),
                status: TaskStatus[taskElementData.status as keyof typeof TaskStatus]
            });
        });
        
        this.taskList.tasks = taskArray;
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
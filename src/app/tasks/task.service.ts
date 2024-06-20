import { Task, Option } from "./task.model";
import taskData from '../../assets/tasks.json';
import { TaskList, emptyTaskList } from "./task-list.model";

export class TaskService {
    
    private taskList: TaskList = emptyTaskList;
    
    private taskTypes: Option[] = [];
    
    private taskStatuses: Option[] = [];

    constructor() {
        this.loadTaskData();
    }

    private loadTaskData(){

        let taskArray: Task[] = [];

        // Load task types
        taskData.taskTypes.forEach(taskType => {
            this.taskTypes.push({
                value: taskType.value,
                displayName: taskType.displayName
            });
        });

        // Load task statuses
        taskData.taskStatuses.forEach(taskStatus => {
            this.taskStatuses.push({
                value: taskStatus.value,
                displayName: taskStatus.displayName
            });
        });

        var taskType: Option | undefined;
        var taskStatus: Option | undefined;
        
        // Load tasks
        taskData.tasks.forEach(taskElementData => {

            taskType = this.taskTypes.find(taskType => taskType.value == taskElementData.type);
            taskStatus = this.taskStatuses.find(taskStatus => taskStatus.value == taskElementData.status);
            
            taskArray.push({
                title: taskElementData.title,
                description: taskElementData.description,
                type: taskType!,
                createdOn: new Date(taskElementData.createdOn),
                status: taskStatus!
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

    public getTaskTypes() {
        return this.taskTypes;
    }

    public getTaskStatuses() {
        return this.taskStatuses;
    }
}
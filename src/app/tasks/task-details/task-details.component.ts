import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task, emptyTask } from '../task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit {

  task: Task | null = null;

  onDeleted() {
    if(this.task !== null && this.task.id !== null) {
      this.taskService.deleteTask(this.task.id);
    }
    this.router.navigate(['tasks']);
  }

  constructor(private router: Router, private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit(): void {
    this.task = this.taskService.getTask(this.route.snapshot.params['id']);
  }

}

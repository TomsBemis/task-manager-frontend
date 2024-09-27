import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasicTask } from '../task.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {

  currentUser = this.authService.currentUserSubject;
  currentUser$ = this.authService.currentUserSubject.asObservable();
  @Output() taskDeletedEvent = new EventEmitter<void>();
  @Input() taskItem: BasicTask = {} as BasicTask;

  onDeleted() {
    this.taskDeletedEvent.emit();
  }

  constructor(private authService: AuthService){}

}

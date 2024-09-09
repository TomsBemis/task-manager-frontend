import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { User } from '../../auth/user.model';
import { BehaviorSubject, first, Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AsyncPipe
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  currentUser = this.authService.currentUserSubject;
  currentUser$ = this.authService.currentUserSubject.asObservable();

  constructor(private authService : AuthService, private router: Router) {}

  onLogout(){
    try {
      this.logoutSubscription = this.authService.logout().subscribe(response => {});
    }
    catch (error: any) {
      console.log(error);
    }
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';

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
    this.authService.logout().subscribe({
      next() {},
      error(errorMessage) { console.log(errorMessage); }
    });
    this.router.navigate(['/login']);
  }
}
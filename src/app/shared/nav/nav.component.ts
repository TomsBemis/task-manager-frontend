import { Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { User } from '../../users/user.model';
import { Subscription } from 'rxjs';

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
export class NavComponent implements OnDestroy{

  currentUser: User | null = null;
  currentUserSubscription: Subscription = this.authService.currentUser$.subscribe(user => {
    this.currentUser = user;
  });
  logoutSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
    this.logoutSubscription.unsubscribe();
  }

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

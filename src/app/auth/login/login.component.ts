import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginCredentials } from '../user.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  loginTaskForm: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });
  loginSubscription : Subscription = new Subscription();
  loginErrorMessage : string = "";

  constructor(
    private authService : AuthService, 
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  onLogin(loginTaskForm: LoginCredentials) {
    
    this.loginSubscription = this.authService.login(loginTaskForm).subscribe({
      next : (response) => {
        this.authService.currentUserSubject.next(response.user);
        this.cookieService.set('loggedIn',"true");
        this.cookieService.set('userId',response.authentication.userId);
        this.cookieService.set('refreshToken', response.authentication.refreshToken);
        this.cookieService.set('accessToken', response.authentication.accessToken);
        this.router.navigate(['/tasks'])
      },
      error : responseError => {
        console.log(responseError);
        this.loginErrorMessage = responseError.error.message;
      }
    });
  }
}

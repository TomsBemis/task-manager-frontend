import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    AuthService
  ],
})
export class LoginComponent implements OnDestroy {
  loginTaskForm: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });
  loginSubscription : Subscription = new Subscription();
  loginErrorMessage : string = "";

  constructor(private authService : AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  onLogin() {
    this.loginSubscription = this.authService.login({
      username : this.loginTaskForm.get('username')?.value,
      password : this.loginTaskForm.get('password')?.value
    }).subscribe(responseData => {
      if(responseData.body){
        localStorage.setItem('loggedIn',"true");
        localStorage.setItem('userId',responseData.body.user.id);
        localStorage.setItem('sessionToken',responseData.body.token);
      }
      this.router.navigate(['/tasks'])
    }, responseError => {
      this.loginErrorMessage = responseError.error.message;
    });
  }
}

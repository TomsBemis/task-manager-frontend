import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginCredentials } from '../../routes/app.routes';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule
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
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  onLogin(loginTaskForm: LoginCredentials) {
    
    this.loginSubscription = this.authService.login(loginTaskForm).subscribe({
      next : (response) => {
        this.router.navigate(['/tasks'])
      },
      error : responseError => {
        this.loginErrorMessage = responseError.error.message;
      }
    });
  }
}

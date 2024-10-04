import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ErrorMessageComponent } from "../../shared/error-message/error-message.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ErrorMessageComponent
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerTaskForm: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    repeatPassword: new FormControl(null, Validators.required),
  });
  registerErrorMessage : string = "";
  registerSubscription : Subscription = new Subscription();

  constructor(
    private authService : AuthService, 
    private router: Router
  ) {}

  onRegister() {

    // Validate input data
    if(this.registerTaskForm.controls['password'].value !== this.registerTaskForm.controls['repeatPassword'].value) {
      this.registerErrorMessage = "Passwords don't match";
      return;
    }

    this.registerSubscription = this.authService.register(this.registerTaskForm.value).subscribe({
      next : (response) => {
      },
      error : responseError => {
        this.registerErrorMessage = responseError.message;
      }
    });
  }
    
}

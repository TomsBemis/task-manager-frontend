import { Component, OnDestroy, OnInit } from '@angular/core';
import { initialRoles, User, UserRole } from '../user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { map, Subscription, switchMap, take } from 'rxjs';
import { Option } from '../../shared/option.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  user: User | null = null;
  allRoles: Option[] = initialRoles;
  rolesCheckboxAttributes: {[key: string]: {
    checked: boolean,
    disabled: boolean
  }} = {};
  editMode: boolean = false;
  updateUserSubscription = new Subscription();

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}
  
  ngOnInit(): void {
    // Get user id from route parameters then pass it as argument for user service
    // set the component task when async method is done
    this.route.params.pipe(
      map(params => params['id'] as string),
      switchMap(userId => {
        return this.userService.getUserById(userId)
      }),
      take(1)
    ).subscribe(responseUser => { 
      this.user = responseUser;
      this.rolesCheckboxAttributes = {
        'USER': {
          checked: true,
          disabled: true 
        },
        'MANAGER': {
          checked: this.user?.role.value === 'MANAGER',
          disabled: false 
        },
        'ADMIN': {
          checked: this.user?.role.value === 'ADMIN',
          disabled: true
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    this.updateUserSubscription.unsubscribe();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onSubmit () {

    // Get filled out form data using form group
    let selectedRoles: UserRole[] = [];
    
    initialRoles.forEach(roleItem => {
      selectedRoles.push({
        role: roleItem,
        enabled: this.rolesCheckboxAttributes[roleItem.value].checked
      });
    });

    if(this.user) {
      this.updateUserSubscription = this.userService.updateUserRoles(this.user.id, selectedRoles).subscribe( updatedUser => {
        if(updatedUser) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/users', this.user?.id])
          });
        }
        else this.router.navigate(['/tasks']);
      });
      this.editMode = false;
    }    
  }

  onRoleChange(event: any, role: string) {
    this.rolesCheckboxAttributes[role].checked = event.target.checked;
  }
}

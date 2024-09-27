import { Component, OnDestroy, OnInit } from '@angular/core';
import { initialRoles, User, UserRole } from '../user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { map, Subscription, switchMap, take } from 'rxjs';
import { Option } from '../../shared/option.model';
import { AuthService } from '../../auth/auth.service';

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
  allRoles: Option[] = [];
  rolesCheckboxAttributes: {[key: string]: {
    checked: boolean,
    disabled: boolean
  }} = {};
  roleEditable: boolean = false;
  editMode: boolean = false;
  updateUserSubscription = new Subscription();

  constructor(
    private route: ActivatedRoute, 
    private userService: UserService, 
    private router: Router, 
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    
    this.route.params.pipe(
      map(params => params['userId'] as string),
      switchMap(userId => {
        return this.userService.getUserById(userId)
      }),
      take(1)
    ).subscribe(responseUser => { 

      this.user = responseUser;

      // Check if logged in user is admin, or if not then compare ids
      let loggedInUser = this.authService.currentUserSubject.getValue();
      if(loggedInUser){
        if(loggedInUser.roles.includes("ADMIN")) this.roleEditable = true;
        else if(loggedInUser?.id != responseUser.id) throw Error("Only users with administrator priviledges or users owners have access.")
      }
      
      this.rolesCheckboxAttributes = {
        'USER': {
          checked: true,
          disabled: true 
        },
        'MANAGER': {
          checked: this.user?.roles.includes("MANAGER"),
          disabled: false 
        },
        'ADMIN': {
          checked: this.user?.roles.includes("ADMIN"),
          disabled: true
        }
      }
    });
    
    for (let key in initialRoles) this.allRoles.push(initialRoles[key]);
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
    
    this.allRoles.forEach(roleItem => {
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

  getUserRoleNames(): string[]{
    if(!this.user) return [];
    return this.user.roles.map((userRole: string) => {
      let foundRole = this.allRoles.find(role => role.value == userRole);
      if(!foundRole) return "";
      return foundRole.displayName;
    })
  }
}

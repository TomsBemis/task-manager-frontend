import { Component, OnDestroy, OnInit } from '@angular/core';
import { Role, User, UserRole } from '../user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { map, Subscription, switchMap, take } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})

export class UserDetailsComponent implements OnInit, OnDestroy {
  

  user: User | null = null;
  roles: string[] = Object.keys(Role);
  rolesCheckboxAttributes: Map<string, RoleInput> = new Map<string, RoleInput>();
  roleEditable: boolean = false;
  editMode: boolean = false;
  updateUserSubscription = new Subscription();

  constructor(
    private route: ActivatedRoute, 
    private userService: UserService, 
    private router: Router, 
    private authService: AuthService,
    private translateService: TranslateService
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
        if(loggedInUser.roles.includes(Role.ADMIN)) this.roleEditable = true;
        else if(loggedInUser?.id != responseUser.id) throw Error("Only users with administrator priviledges or users owners have access.")
      }
      
      // Set the initial values and attribtues of role checkboxes
      this.rolesCheckboxAttributes = new Map<string, RoleInput>([
        [Role.USER, {name: Role.USER, checked: true, disabled: true}],
        [Role.MANAGER, {name: Role.MANAGER, checked: this.user?.roles.includes(Role.MANAGER), disabled: false}],
        [Role.ADMIN, {name: Role.ADMIN, checked: this.user?.roles.includes(Role.ADMIN), disabled: true}],
      ]);
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
    
    this.roles.forEach(roleItem => {
      selectedRoles.push({
        role: roleItem,
        enabled: this.rolesCheckboxAttributes.get(roleItem)?.checked ?? false
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
    let roleInputByName: RoleInput | undefined = this.rolesCheckboxAttributes.get(role); 
    if(roleInputByName) {
      roleInputByName.checked = event.target.checked;
      this.rolesCheckboxAttributes.set(role, roleInputByName);
    }
  }
  
  getUserRoleNames(): string {
    if(!this.user) return "";
    return this.user.roles.map(
      (role) => this.translateService.instant('user.role.'+role)
    ).join(", ");
  }
}

interface RoleInput {
  name: string,
  checked: boolean,
  disabled: boolean
}

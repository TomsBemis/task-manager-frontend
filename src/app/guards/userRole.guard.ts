import { CanActivateFn, Router } from "@angular/router";
import { Option } from "../shared/option.model";
import { AuthService } from "../auth/auth.service";
import { inject } from "@angular/core";
import { User } from "../users/user.model";

export const userRoleGuard = (criteriaRoles: Option[], whitelist: boolean): CanActivateFn => {
  
  return async (route, state): Promise<boolean> => {
  
    const router = inject(Router);

    // Check if user is authenticated
    const authenticatedUser: User | null = inject(AuthService).currentUserSubject.getValue();  
    if(!authenticatedUser) { 
      router.navigate(['/login']);
      throw Error("User is null in provided AuthService"); 
    }

    // Check if user has appropriate role
    if(whitelist) {
      for (let i = 0; i < criteriaRoles.length; i++) {
        if(authenticatedUser.role.value == criteriaRoles[i].value) {
          return true;
        }
      }
      return false;
    }
    else {
      for (let i = 0; i < criteriaRoles.length; i++) {
        if(authenticatedUser.role.value == criteriaRoles[i].value) {
          return false;
        }
      }
      return true;
    }
  }
}
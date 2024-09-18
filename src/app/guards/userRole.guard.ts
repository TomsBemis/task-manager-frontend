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
    let matchingRoleFound: boolean = false;
    
    criteriaRoles.every(criteriaRole => {
      if (criteriaRole.value == authenticatedUser.role.value) matchingRoleFound = true;
    });

    // If role is whitelisted and found in user's roles then allow access
    if(whitelist) return matchingRoleFound;
    // If role is blacklisted deny access if the user has it
    else return !matchingRoleFound;
  }
}
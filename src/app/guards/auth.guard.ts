import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

export const authGuard: CanActivateFn = async (route, state): Promise<boolean> => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.currentUserSubject.getValue()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
}
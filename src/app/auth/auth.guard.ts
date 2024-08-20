import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = async (route, state): Promise<boolean> => {

  const cookieService = inject(CookieService);
  const router = inject(Router);

  if (cookieService.get("loggedIn") == "true") {
    return true;
  }
  router.navigate(['/login']);
  return false;
}
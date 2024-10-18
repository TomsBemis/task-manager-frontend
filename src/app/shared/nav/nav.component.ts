import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from '../translate/localization.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    TranslateModule
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  currentUser = this.authService.currentUserSubject;
  currentUser$ = this.authService.currentUserSubject.asObservable();

  currentLanguage: string = this.localizationService.currentLanguage;
  languageNames = new Map<string, string>([
    ["lv", "LAT"],
    ["en", "ENG"]
  ]);

  constructor(
    private authService : AuthService, 
    private router: Router,
    private localizationService: LocalizationService
  ) {}

  onLogout(){
    this.authService.logout().subscribe({
      next() {},
      error(errorMessage) { console.log(errorMessage); }
    });
    this.router.navigate(['/login']);
  }

  onChangeLanguage(language: any) {
    this.localizationService.changeLanguage(language.target.value);
  }
}
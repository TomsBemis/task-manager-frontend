import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Option } from '../../shared/option.model';

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

  currentLanguage: string = this.translateService.currentLang;
  languages: string[] = this.translateService.getLangs();
  languageNames = new Map<string, string>([
    ["lv", "LAT"],
    ["en", "ENG"]
  ]);

  constructor(
    private authService : AuthService, 
    private router: Router,
    private translateService: TranslateService
  ) {}

  onLogout(){
    this.authService.logout().subscribe({
      next() {},
      error(errorMessage) { console.log(errorMessage); }
    });
    this.router.navigate(['/login']);
  }

  onChangeLanguage(language: any) {
    this.translateService.use(language.target.value);
  }
}
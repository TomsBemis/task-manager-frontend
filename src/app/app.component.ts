import { Component } from '@angular/core';
import { TasksComponent } from './tasks/tasks.component';
import { NavComponent } from './shared/nav/nav.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TasksComponent,
    NavComponent,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'task-manager';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'lv']);
    this.translate.setDefaultLang('lv');
    this.translate.use('lv');
  }
}

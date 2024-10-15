import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateStore, TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../app.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '../../assets/i18n/','.json');

}

@NgModule({

  declarations: [],

  imports: [
    AppComponent,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    TranslateStore,
    TranslateService
  ],
  exports: [TranslateModule],

})

export class NgxTranslateModule { }
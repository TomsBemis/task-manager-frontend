import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, '../../assets/i18n/','.json');
  }

@Injectable({ providedIn: "root" })
export class LocalizationService {

    public currentLanguage: string = "";
    public languages: string[] = this.translateService.getLangs();

    constructor(private translateService: TranslateService) {
        this.translateService.addLangs(['en', 'lv']);
        this.translateService.setDefaultLang('en');
        this.translateService.use('en');
        this.currentLanguage = this.translateService.currentLang;
    }

    changeLanguage(language: string) {
      this.translateService.use(language);
      this.currentLanguage = this.translateService.currentLang;
    }
}
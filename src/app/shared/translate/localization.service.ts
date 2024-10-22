import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

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
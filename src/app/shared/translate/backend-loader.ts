import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { beApiRoutes } from "../../routes/be-api.routes";

export class BackendLoader implements TranslateLoader {

    constructor(private http: HttpClient) {}
  
    public getTranslation(language: string): Observable<any> {
      return this.http.get(beApiRoutes.localization + '/' + language);  
    }
  }
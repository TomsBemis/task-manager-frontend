import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes as appRoutes } from './routes/app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { tokenInterceptorProvider } from './auth/token.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BackendLoader } from './shared/translate/backend-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule
    ),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useClass: BackendLoader,
          deps: [HttpClient]
     }
    })),
    provideRouter(appRoutes), 
    provideClientHydration(),
    tokenInterceptorProvider,
  ]
};

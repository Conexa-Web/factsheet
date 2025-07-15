/* import { enableProdMode } from '@angular/core'; */
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
/* import { Amplify } from 'aws-amplify'; */
/* import { environment } from './environments/environment'; */
/* import { config } from '@shared_core/amplify/amplify.config'; */

/* import { FsNuevoComponent } from './app/fs-nuevo/fs-nuevo.component'; */
/* Amplify.configure(config);

if (environment.production) {
  enableProdMode();
} */

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

/* bootstrapApplication(FsNuevoComponent, appConfig)
  .catch((err) => console.error(err)); */

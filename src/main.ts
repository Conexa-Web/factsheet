import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { FsNuevoComponent } from './app/fs-nuevo/fs-nuevo.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

bootstrapApplication(FsNuevoComponent, appConfig)
  .catch((err) => console.error(err));

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { createInspectorDevtools } from '@rxjs-inspector/devtools';

if (environment.production) {
  enableProdMode();
}

createInspectorDevtools();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));

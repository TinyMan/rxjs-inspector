import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { ObservableListComponent } from './components/observable-list/observable-list.component';
import { reducers } from './store';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, ObservableListComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers),
    environment.production ? [] : StoreDevtoolsModule.instrument(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

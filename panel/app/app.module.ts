import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { ObservableListComponent } from './components/observable-list/observable-list.component';
import { reducers } from './store';

@NgModule({
  declarations: [AppComponent, ObservableListComponent],
  imports: [BrowserModule, StoreModule.forRoot(reducers)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

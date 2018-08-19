import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StoreModule, MetaReducer } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AppComponent } from './app.component';
import { ObservableListComponent } from './components/observable-list/observable-list.component';
import { reducers, State, enableBatchReducer } from './store';
import { environment } from '../environments/environment';
import { ObservableComponent } from './components/observable/observable.component';
import { MarbleViewComponent } from './components/marble-view/marble-view.component';
import { DraggableDirective } from './directives/draggable.directive';
import { ZoomableDirective } from './directives/zoomable.directive';
import { StickyDirective } from './directives/sticky.directive';
import { RootSvgDirective } from './directives/root-svg.directive';

export const metaReducers: MetaReducer<State>[] = [enableBatchReducer];

@NgModule({
  declarations: [
    AppComponent,
    ObservableListComponent,
    ObservableComponent,
    MarbleViewComponent,
    DraggableDirective,
    ZoomableDirective,
    StickyDirective,
    RootSvgDirective,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({ maxAge: 10 }),
    NgxJsonViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

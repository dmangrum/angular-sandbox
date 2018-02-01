import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EsriLoaderModule } from 'angular-esri-loader';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { ObservableTestsComponent } from './observable-tests/observable-tests.component';
import { WebsocketTestsComponent } from './websocket-tests/websocket-tests.component';

const appRoutes: Routes = [
  { path: 'esri-map', component: EsriMapComponent },
  { path: 'observable-tests', component: ObservableTestsComponent },
  { path: 'websocket-tests', component: WebsocketTestsComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    ObservableTestsComponent,
    WebsocketTestsComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    EsriLoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

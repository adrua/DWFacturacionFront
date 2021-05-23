import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './app.shared.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

import { httpInterceptorProviders  } from './_helpers';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { getPaginatorIntl } from './components/paginator.i18n.provider';
import { BlockUIModule } from 'ng-block-ui';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    BlockUIModule.forRoot(),
  ],
  entryComponents: [],
  providers: [ 
    httpInterceptorProviders,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MatPaginatorIntl, useFactory: getPaginatorIntl, deps: [TranslateService] },
    { provide: 'production', useValue: true },
    { provide: 'dataBrowserServiceUrl', useValue: environment.dataBrowserServiceUrl },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

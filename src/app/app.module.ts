import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from '@app/config/index';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DownloadComponent } from './download/download.component';
import { IndexComponent } from './index/index.component';
import { DialogComponent } from './dialog/dialog.component';
import { DescriptionComponent } from './description/description.component';
import { AlcoholComponent } from './alcohol/alcohol.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    DownloadComponent,
    IndexComponent,
    DialogComponent,
    DescriptionComponent,
    AlcoholComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

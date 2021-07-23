import { NgModule, APP_INITIALIZER  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/http.error.interceptor';

import { FooterComponent } from './shared/components/footer/footer.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { LoginComponent } from './shared/components/login/login.component';
import { EmailChangingComponent } from './components/complete-email-changing/complete-email-changing.component';
import { RegistrationSubmitComponent } from './components/complete-registration/complete-registration.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UserProfileComponent, SubscriptionDialog } from './components/user-profile/user-profile.component';
import { ProductsComponent } from './components/products/products.component';
import { GraphComponent } from './components/graph/graph.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavigationComponent,
    LoginComponent,
    RegistrationComponent,
    HomePageComponent,
    UserProfileComponent,
    EmailChangingComponent,
    RegistrationSubmitComponent,
    SubscriptionDialog,
    ProductsComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

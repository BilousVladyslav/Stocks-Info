import { NgModule } from '@angular/core';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EmailChangingComponent } from './components/complete-email-changing/complete-email-changing.component';
import { RegistrationSubmitComponent } from './components/complete-registration/complete-registration.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { GraphComponent } from './components/graph/graph.component';
import { ProductsComponent } from './components/products/products.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'profile',
    component: UserProfileComponent,
    pathMatch: 'full' 
  },
  {
    path: 'register',
    component: RegistrationComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'graph/:id',
    component: GraphComponent
  },
  {
    path: 'change_email/:link',
    component: EmailChangingComponent
  },
  {
    path: 'registration_complete/:link',
    component: RegistrationSubmitComponent,
  },
  {
    path: '',
    component: HomePageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

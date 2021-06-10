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
    path: '',
    component: HomePageComponent
  },
  {
    path: 'profile/change_email/:link',
    component: EmailChangingComponent
  },
  {
    path: 'profile/registration_complete/:link',
    component: RegistrationSubmitComponent
  },
  {
    path: 'profile',
    component: UserProfileComponent
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

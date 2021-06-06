import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authorization.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  isLogged = false;

  constructor(
    private router: Router,
    private autorizationService: AuthenticationService,
  ) {
    autorizationService.token.subscribe(value => this.isLogged = value != null) ;
   }

   ngOnInit(): void {}


  logOut(): void {
    this.autorizationService.logout();
    this.isLogged = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authorization.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  isLogged = false;
  
  constructor(
    private autorizationService: AuthenticationService,
  ) {
    autorizationService.token.subscribe(value => this.isLogged = value != null) ;
   }

  ngOnInit(): void {
  }

}

import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ConfirmRegistrationService } from 'src/app/core/services/confirm-registration.service';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.css']
})
export class RegistrationSubmitComponent implements OnDestroy {
  success: boolean = false;
  link: string;
  subscription: Subscription = new Subscription();
  
  constructor(
    private service: ConfirmRegistrationService,
    private route: ActivatedRoute
  ) {
    this.link = this.route.snapshot.params['link'];
    this.subscription.add(this.service.ConfirmRegistration(this.link).subscribe(data => this.success = true, error => this.success = false)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

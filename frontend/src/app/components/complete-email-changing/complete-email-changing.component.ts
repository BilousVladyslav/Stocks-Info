import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ConfirmEmailChangingService } from 'src/app/core/services/confirm-email-changing.service';

@Component({
  selector: 'app-complete-email-changing',
  templateUrl: './complete-email-changing.component.html',
  styleUrls: ['./complete-email-changing.component.css']
})
export class EmailChangingComponent implements OnDestroy {
  success: boolean = false;
  link: string;
  subscription: Subscription = new Subscription();
  
  constructor(
    private service: ConfirmEmailChangingService,
    private route: ActivatedRoute
  ) {
    this.link = this.route.snapshot.params['link'];
    this.subscription.add(this.service.ConfirmEmail(this.link).subscribe(data => this.success = true, error => this.success = false)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

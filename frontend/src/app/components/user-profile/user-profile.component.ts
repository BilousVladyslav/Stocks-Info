import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SubscriptionsService } from 'src/app/core/services/subscriptions.service';
import { User, ChangePassword, ChangeEmail } from 'src/app/core/models/user.model';
import { PaymentModel } from 'src/app/core/models/payment.model';
import { SubscriptionModel, SubscriptionInfoModel } from 'src/app/core/models/subscription.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authorization.service';
import { NameRegex } from 'src/app/core/regexes/name.regex';
import { EmailRegex } from 'src/app/shared/regexes/email.regex';
import { PasswordRegex } from 'src/app/shared/regexes/password.regex';
import { FormControlMustMatchValidate } from 'src/app/shared/validators/form-control-match.validate';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnDestroy {
  date_now = new Date();
  displayedColumns: string[] = ['id', 'status', 'amount', 'subscription_start', 'subscription_end'];
  subscriptionsData: SubscriptionModel[] = [];
  subscription: Subscription = new Subscription();
  user: User = new User;
  userProfileForm: FormGroup;
  changeEmailForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor(
    private profileService: ProfileService,
    private subscriptionService: SubscriptionsService,
    private authorizationService: AuthenticationService,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    authorizationService.token.subscribe(value => {
      if(value == null){
        this.router.navigate(['']);
      }
    });
    this.GetUserProfile();
    this.getSubscriptions();
    this.userProfileForm = this.fb.group({
      first_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
      last_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
    });
    this.changeEmailForm = this.fb.group({
      new_email: new FormControl(
        '', [Validators.required, Validators.pattern(EmailRegex.Regex)]),
    });
    this.changePasswordForm = this.fb.group({
      old_password: new FormControl(
        '', [Validators.required]),
      new_password: new FormControl(
        '', [Validators.required, Validators.minLength(8), Validators.pattern(PasswordRegex.Regex), Validators.maxLength(40)]),
      password_second: new FormControl(
        '', [Validators.required]),
    },
    {
      validator: FormControlMustMatchValidate('new_password', 'password_second')
    });
  }

  CreateForm(): void {
    this.userProfileForm = this.fb.group({
      first_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
      last_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
    });
  }

  GetUserProfile(): void {
    this.subscription.add(this.profileService.GetUserProfile()
      .subscribe(data => {
        this.user = data;
      })
    );
  }
  isCurrentSubscription(subscription: SubscriptionModel): boolean {
    let start_date = subscription.subscription_start;
    let end_date = subscription.subscription_end;
    return new Date(start_date!) <= new Date() && new Date(end_date!) >= new Date()
  }

  EditUserProfile(): void {
    this.subscription.add(this.profileService.EditUserProfile(this.user)
      .subscribe(data => {
        this.user = data;
        this._snackBar.open('Success!', 'Close', {
          duration: 3000,
        });
      },
      error => {
        this._snackBar.open('Wrong data,', 'Close', {
          duration: 3000,
        });
      })
    );
  }

  changeEmail(): void {
    this.subscription.add(this.profileService.ChangeEmail(this.changeEmailForm.value as ChangeEmail)
      .subscribe(data => {
        this.changeEmailForm.reset();
        this._snackBar.open('Success! Activation link sent to your email.', 'Close', {
          duration: 5000,
        });
      },
      error => {
        this._snackBar.open('Unknown error', 'Close', {
          duration: 3000,
        });
      })
    );
  }

  changePassword(): void {
    this.subscription.add(this.profileService.ChangePassword(this.changePasswordForm.value as ChangePassword)
      .subscribe(data => {
        this.changePasswordForm.reset();
        this._snackBar.open('Success! Password was changed.', 'Close', {
          duration: 5000,
        });
      },
      error => {
        this._snackBar.open('Unknown error', 'Close', {
          duration: 3000,
        });
      })
    );
  }

  getSubscriptions(): void {
    this.subscription.add(this.subscriptionService.GetSubscriptions().subscribe(data => this.subscriptionsData = data))
  }

  testJob(): void {
    console.log(true);
    
  }

  openDialog(){
    this.dialog.open(SubscriptionDialog);
  }

  onSubmitProfile(): void {
    this.EditUserProfile();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


@Component({
  selector: 'subscription-dialog',
  templateUrl: 'subscription.dialog.html',
})
export class SubscriptionDialog {
  public subscriptionData: SubscriptionInfoModel = new SubscriptionInfoModel;
  public subscription: SubscriptionModel = new SubscriptionModel;

  constructor(
    private subscriptionService: SubscriptionsService,
    public dialogRef: MatDialogRef<SubscriptionDialog>,
  ) {
    this.subscriptionService.GetSubscriptionData().subscribe(data => {
      this.subscriptionData = data;
      this.subscriptionService.CreateSubscription().subscribe(data => this.subscription = data)
    })
  }

  onNoClick(): void {
    this.subscriptionService.DeleteSubscription(this.subscription.id as string).subscribe(() => this.dialogRef.close())
  }

}
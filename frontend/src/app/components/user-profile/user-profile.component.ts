import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';
import { User, ChangePassword, ChangeEmail } from 'src/app/core/models/user.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authorization.service';
import { NameRegex } from 'src/app/core/regexes/name.regex';
import { EmailRegex } from 'src/app/shared/regexes/email.regex';
import { PasswordRegex } from 'src/app/shared/regexes/password.regex';
import { FormControlMustMatchValidate } from 'src/app/shared/validators/form-control-match.validate';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnDestroy {
  subscription: Subscription = new Subscription();
  user: User = new User;
  userProfileForm: FormGroup;
  changeEmailForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor(
    private profileService: ProfileService,
    private authorizationService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.GetUserProfile();
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

  onSubmitProfile(): void {
    this.EditUserProfile();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProfileService } from 'src/app/core/services/profile.service';
import { User } from 'src/app/core/models/user.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authorization.service';
import { NameRegex } from 'src/app/core/regexes/name.regex';
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

  onSubmitProfile(): void {
    this.EditUserProfile();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

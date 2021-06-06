import { Component, OnInit, Output, OnDestroy, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';

import { AuthenticationService } from 'src/app/core/services/authorization.service';
import { RegisterService } from 'src/app/core/services/registration.service';
import { EmailRegex } from 'src/app/shared/regexes/email.regex';
import { PasswordRegex } from 'src/app/shared/regexes/password.regex';
import { NameRegex } from 'src/app/shared/regexes/name.regex';
import { FormControlMustMatchValidate } from 'src/app/shared/validators/form-control-match.validate';
import { RegistrationModel } from 'src/app/core/models/registration.model';
import { UserLogin } from 'src/app/core/models/user-login.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  private subscription: Subscription = new Subscription();
  errorMessage: string = '';
  isLogged = false;

  constructor(
    private fb: FormBuilder,
    private authorizationService: AuthenticationService,
    private registerService: RegisterService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({
      username: new FormControl(
        '', [Validators.required, Validators.minLength(5)]),
      email: new FormControl(
        '', [Validators.required, Validators.pattern(EmailRegex.Regex)]),
      password: new FormControl(
        '', [Validators.required, Validators.minLength(8), Validators.pattern(PasswordRegex.Regex), Validators.maxLength(40)]),
      password_second: new FormControl(
        '', [Validators.required]),
      first_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
      last_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)])
    },
    {
      validator: FormControlMustMatchValidate('password', 'password_second')
    });
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      username: new FormControl(
        '', [Validators.required, Validators.minLength(5)]),
      email: new FormControl(
        '', [Validators.required, Validators.pattern(EmailRegex.Regex)]),
      password: new FormControl(
        '', [Validators.required, Validators.minLength(8), Validators.pattern(PasswordRegex.Regex), Validators.maxLength(40)]),
      password_second: new FormControl(
        '', [Validators.required]),
      first_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
      last_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)])
    },
    {
      validator: FormControlMustMatchValidate('password', 'password_second')
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerComplete();
    }
  }

  registerComplete(): void {
    const registerUsertViewModel = this.registerForm.value as RegistrationModel;
    this.register_user(registerUsertViewModel);
  }

  register_user(registerViewModel: RegistrationModel): void {
    this.subscription.add(this.registerService.register(registerViewModel).subscribe(
      res => {
        this._snackBar.open('Registration complete! Visit your email to confirm your profile.', 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/'])
      },
      errors => {
        this.errorMessage = errors.message;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

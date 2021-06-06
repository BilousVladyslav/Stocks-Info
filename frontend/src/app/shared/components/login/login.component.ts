import { Component, OnInit, OnDestroy, ViewChild, Inject, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authorization.service';
import { UserLogin } from 'src/app/core/models/user-login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  private subscription: Subscription = new Subscription();
  submited: boolean;
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.authenticationService.token) {
      this.router.navigate(['/']);
    }
    this.submited = false;

    this.loginForm = this.fb.group({
      username: new FormControl(
        '', [Validators.required]),
      password: new FormControl(
        '', [Validators.required])
    });
  }

  onSubmit(): void {
    this.submited = true;
    const loginViewModel = this.loginForm.value as UserLogin;
    if (this.loginForm.valid){
      this.login(loginViewModel);
    }
  }

  login(loginViewModel: UserLogin): void {
    this.subscription.add(this.authenticationService
      .login(loginViewModel)
      .subscribe(
        res => {
          document.getElementById('closeModal')!.click();
          this.router.navigate(['']);
        },
        errors => this.errorMessage = errors.message)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

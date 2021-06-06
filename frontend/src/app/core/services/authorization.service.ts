import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { TokenResponse } from 'src/app/core/models/token.model';
import { UserLogin } from 'src/app/core/models/user-login.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private tokenSubject: BehaviorSubject<TokenResponse | null>;
    public token: Observable<TokenResponse | null>;
    private refreshTokenTimeout;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        let token = localStorage.getItem('token');
        if(token != null){
            this.tokenSubject = new BehaviorSubject<TokenResponse | null>(JSON.parse(token) as TokenResponse);
            this.startRefreshTokenTimer();
        } else {
            this.tokenSubject = new BehaviorSubject<TokenResponse | null>(null);
        }
        this.token = this.tokenSubject.asObservable();
    }

    public get tokenValue(): TokenResponse | null {
        return this.tokenSubject.value;
    }

    login(loginModel: UserLogin) {
        return this.http.post<any>(`${environment.apiURL}/token/`, loginModel)
            .pipe(map(token => {
                this.tokenSubject.next(token);
                localStorage.setItem('token', JSON.stringify(token));
                this.startRefreshTokenTimer();
                return token;
            }));
    }

    logout() {
        this.stopRefreshTokenTimer();
        this.tokenSubject.next(null);
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }

    refreshToken() {
        let refresh = this.tokenValue?.refresh;
        return this.http.post<any>(`${environment.apiURL}/token/refresh/`, {'refresh': refresh})
            .pipe(map((token) => {
                this.tokenSubject.next(token);
                localStorage.setItem('token', JSON.stringify(token));
                this.startRefreshTokenTimer();
                return token;
            }), catchError( (error) => {
                this.logout();
                return error
            }));
    }

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.tokenValue!.access.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}
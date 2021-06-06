import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, ChangeEmail, ChangePassword } from 'src/app/core/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  controllerUrl: string = environment.apiURL + '/profile/';

  constructor(private http: HttpClient) {}

  GetUserProfile(): Observable<User> {
    return this.http.get<User>(this.controllerUrl);
  }

  EditUserProfile(profile: User): Observable<User> {
    return this.http.put<User>(this.controllerUrl, profile);
  }

  DeleteUserProfile(): Observable<User> {
    return this.http.delete<User>(this.controllerUrl);
  }

  ChangePassword(passwords: ChangePassword): Observable<any> {
    return this.http.post<any>(this.controllerUrl + 'change_password/', passwords);
  }

  ChangeEmail(email: ChangeEmail): Observable<any> {
    return this.http.post<any>(this.controllerUrl + 'change_email/', email);
  }
}

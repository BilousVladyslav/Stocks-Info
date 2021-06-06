import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfirmRegistrationService {
  controllerUrl: string = environment.apiURL + '/profile/registration/complete/';

  constructor(private http: HttpClient) {}

  ConfirmRegistration(link: string): Observable<any> {
    return this.http.get<any>(this.controllerUrl + link + '/');
  }
}

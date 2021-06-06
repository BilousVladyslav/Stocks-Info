import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfirmEmailChangingService {
  controllerUrl: string = environment.apiURL + '/profile/change_email/';

  constructor(private http: HttpClient) {}

  ConfirmEmail(link: string): Observable<any> {
    return this.http.get<any>(this.controllerUrl + link + '/');
  }
}

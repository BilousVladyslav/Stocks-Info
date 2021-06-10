import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionModel, SubscriptionInfoModel } from 'src/app/core/models/subscription.model';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  controllerUrl: string = environment.apiURL + '/subscription/';

  constructor(private http: HttpClient) {}

  GetSubscriptions(): Observable<SubscriptionModel[]> {
    return this.http.get<SubscriptionModel[]>(this.controllerUrl);
  }

  GetSubscriptionData(): Observable<SubscriptionInfoModel> {
    return this.http.get<SubscriptionInfoModel>(environment.apiURL + '/subscriptions/data/');
  }

  DeleteSubscription(id: string): Observable<SubscriptionModel> {
    return this.http.delete<SubscriptionModel>(this.controllerUrl + id + '/');
  }

  CreateSubscription(): Observable<SubscriptionModel> {
    return this.http.post<SubscriptionModel>(this.controllerUrl, {});
  }
}

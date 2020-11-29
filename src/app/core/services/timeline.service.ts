import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  constructor(public httpService: HttpService) {}

  getUsersTimeline(userId: string): Promise<any> {
    return this.httpService.get(
      `/users-timeline/advanced-user-timeline/${userId}`
    ).toPromise();
  }
}
